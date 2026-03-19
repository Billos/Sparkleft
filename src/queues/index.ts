import { DelayedError, Job, Queue, Worker } from "bullmq"
import { DateTime } from "luxon"
import pino from "pino"

import { env } from "../config"
import { notifier } from "../modules/notifiers"
import { AboutService } from "../types"
import { JobIds } from "./constants"
import { addJobToQueue } from "./jobs"
import { BaseJob, BudgetJob, EndpointJob, SimpleJob, TransactionJob } from "./jobs/BaseJob"
import { AutoImportJob } from "./jobs/autoImport"
import { CheckBudgetLimitJob } from "./jobs/checkBudgetLimit"
import { InitJob } from "./jobs/init"
import { LinkPaypalTransactionsJob } from "./jobs/linkPaypalTransactions"
import { RemoveTransactionMessagesJob } from "./jobs/removeTransactionMessages"
import { SetBudgetForTransactionJob } from "./jobs/setBudgetForTransaction"
import { SetCategoryForTransactionJob } from "./jobs/setCategoryForTransaction"
import { UnbudgetedTransactionsJob } from "./jobs/unbudgetedTransactions"
import { UncategorizedTransactionsJob } from "./jobs/uncategorizedTransactions"
import { UpdateBillsBudgetLimitJob } from "./jobs/updateBillsBudgetLimit"
import { UpdateLeftoverBudgetLimitJob } from "./jobs/updateLeftoverBudgetLimit"
import { isBudgetJobArgs, isEndpointJobArgs, isTransactionJobArgs, QueueArgs } from "./queueArgs"

const logger = pino()

const startedAt = new Map<string, DateTime>()

// Exported arrays populated lazily on first initJobInstances() call so that
// module-level code never calls `new XxxJob()` (which would fail under
// circular-dependency loading order).
export const simpleJobs: SimpleJob[] = []

export const transactionJobs: TransactionJob[] = []

export const budgetJobs: BudgetJob[] = []

const endpointJobs: EndpointJob[] = []
const jobMap = new Map<string, BaseJob>()

let queue: Queue<QueueArgs> | null = null
let worker: Worker<QueueArgs> | null = null

async function getQueue(): Promise<Queue<QueueArgs>> {
  if (queue) {
    return queue
  }

  queue = new Queue("manager", { connection: env.redisConnection })
  return queue
}

function logJobDuration(success: boolean, jobId: string, name: string) {
  const startTime = startedAt.get(jobId)
  const successStr = success ? "completed" : "failed"
  const endTime = DateTime.now()
  if (startTime) {
    const duration = endTime.diff(startTime, "seconds").seconds
    logger.info(
      "******************************************************************************** Job(%s) %s %s in %d seconds",
      jobId,
      name,
      successStr,
      duration,
    )
    startedAt.delete(jobId)
  } else {
    logger.info("******************************************************************************** Job(%s) %s %s", jobId, name, successStr)
  }
}

async function delayJob(job: Job<QueueArgs>, err: Error): Promise<void> {
  const retryCount = (job.data.retryCount || 0) + 1
  const jobInstance = jobMap.get(job.data.job)
  const delayMs = jobInstance ? jobInstance.getRetryDelay(retryCount) : retryCount * 60 * 1000
  const delayed = DateTime.now().plus({ milliseconds: delayMs })
  const timestamp = delayed.toMillis()
  const title = err.message
  const message = [
    `Job **${job.data.job}** (${job.id}) failed with error ${err.message}.`,
    `Attempt: ${retryCount}`,
    `Delaying until ${delayed.toISOTime()} with data ${JSON.stringify(job.data)}.`,
  ].join("\n")
  const delayedMessageId = await notifier.sendMessageImpl(title, message)

  logger.info(
    "Delaying job %s (%s) until %s - Attempt: %d - Error: %s",
    job.id,
    job.name,
    delayed.toISO(),
    retryCount,
    err?.message ?? "Unknown error",
  )
  await job.updateData({ ...job.data, delayedMessageId, retryCount })
  await job.moveToDelayed(timestamp, job.token)
  throw new DelayedError("Job delayed due to error")
}

async function setupAutoImportScheduler(): Promise<void> {
  if (!env.autoImportCron) {
    logger.info("AUTO_IMPORT_CRON is not set, skipping auto-import scheduler setup")
    return
  }
  const queue = await getQueue()
  logger.info("Setting up auto-import scheduler with cron '%s'", env.autoImportCron)
  try {
    await queue.upsertJobScheduler(
      "auto-import-repeat",
      { pattern: env.autoImportCron },
      { name: JobIds.AUTO_IMPORT, data: { job: JobIds.AUTO_IMPORT } },
    )
  } catch (err) {
    logger.error({ err }, "Failed to set up auto-import scheduler; auto-import will not run automatically")
  }
}

function initJobInstances() {
  if (simpleJobs.length > 0) {
    return
  }

  simpleJobs.push(new UpdateLeftoverBudgetLimitJob(), new UpdateBillsBudgetLimitJob(), new LinkPaypalTransactionsJob())

  transactionJobs.push(new UnbudgetedTransactionsJob(), new UncategorizedTransactionsJob(), new RemoveTransactionMessagesJob())

  endpointJobs.push(new SetCategoryForTransactionJob(), new SetBudgetForTransactionJob())

  budgetJobs.push(new CheckBudgetLimitJob(), new InitJob())

  const autoImport = new AutoImportJob()

  for (const j of [...simpleJobs, ...transactionJobs, ...endpointJobs, ...budgetJobs, autoImport]) {
    jobMap.set(j.id, j)
  }
}

async function initializeWorker(): Promise<Worker<QueueArgs>> {
  if (worker) {
    return worker
  }

  initJobInstances()

  const queue = await getQueue()
  await setupAutoImportScheduler()

  // Clean up any stale jobs from previous runs
  queue.setGlobalConcurrency(1)
  await queue.pause()
  await queue.resume()

  worker = new Worker<QueueArgs>(
    "manager",
    async (job) => {
      try {
        const { data } = job
        await AboutService.getAbout()
        const jobInstance = jobMap.get(data.job)
        if (!jobInstance) {
          throw new Error(`Unknown job: ${data.job}`)
        }
        if (isTransactionJobArgs(data)) {
          await (jobInstance as TransactionJob).run(data.transactionId)
        } else if (isBudgetJobArgs(data)) {
          await (jobInstance as BudgetJob).run(data.budgetId)
        } else if (isEndpointJobArgs(data)) {
          await (jobInstance as EndpointJob).run(data.transactionId, data.data)
        } else {
          await (jobInstance as SimpleJob).run()
        }
      } catch (err) {
        const jobInstance = jobMap.get(job.data.job)
        if (!jobInstance?.retryable) {
          throw err
        }
        await delayJob(job, err as Error)
      }
    },
    {
      connection: env.redisConnection,
      concurrency: 1,
      removeOnComplete: { count: 5000 },
      removeOnFail: { count: 5000 },
    },
  )

  worker.on("active", async ({ id, name, data }) => {
    logger.info("******************************************************************************** Job(%s) %s started", id, name)
    startedAt.set(id, DateTime.now())
    if (data.delayedMessageId) {
      logger.info("Deleting delayed message %s for job %s (%s)", data.delayedMessageId, id, name)
      await notifier.deleteMessageImpl(data.delayedMessageId, null)
    }
  })

  worker.on("completed", async ({ id, name, data }) => {
    if (data.delayedMessageId) {
      logger.info("Deleting delayed message %s for job %s (%s)", data.delayedMessageId, id, name)
      await notifier.deleteMessageImpl(data.delayedMessageId, null)
    }
    logJobDuration(true, id, name)
  })

  worker.on("failed", (job, err) => {
    logger.error({ err }, "Job %s failed with error %s", job.id, err.message)
    notifier.sendMessageImpl(
      "Job Failed",
      `Job **${job.data.job}** (${job.id}) failed with error ${err.message} and data ${JSON.stringify(job.data)}`,
    )

    logJobDuration(false, job.id, job.name)
  })

  worker.on("ready", async () => {
    logger.info("Worker is ready and connected to Redis")
    await addJobToQueue(JobIds.INIT, true)
  })

  return worker
}

async function processExit() {
  if (worker) {
    await worker.close()
  }
}

process.on("SIGTERM", processExit)
process.on("SIGINT", processExit)

export { getQueue, initializeWorker }
