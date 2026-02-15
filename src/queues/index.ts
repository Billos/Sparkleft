import { DelayedError, Job, Queue, Worker } from "bullmq"
import { DateTime } from "luxon"
import pino from "pino"

import { env } from "../config"
import { notifier } from "../modules/notifiers"
import { AboutService } from "../types"
import { JobIds } from "./constants"
import { addJobToQueue } from "./jobs"
import * as CheckBudgetLimit from "./jobs/checkBudgetLimit"
import * as Init from "./jobs/init"
import * as LinkPaypalTransactions from "./jobs/linkPaypalTransactions"
import * as SetTransactionAttributes from "./jobs/setTransactionAttributes"
import * as UnbudgetedTransactions from "./jobs/unbudgetedTransactions"
import * as UncategorizedTransactions from "./jobs/uncategorizedTransactions"
import * as UpdateBillsBudgetLimit from "./jobs/updateBillsBudgetLimit"
import * as UpdateLeftoversBudgetLimit from "./jobs/updateLeftoverBudgetLimit"
import { isBudgetJobArgs, isEndpointJobArgs, isTransactionJobArgs, QueueArgs } from "./queueArgs"

const logger = pino()
type AbstractJobDefinition = {
  id: JobIds
  init?: () => Promise<void>
}
type TransactionJobDefinition = AbstractJobDefinition & {
  job: (transactionId: string) => Promise<void>
}
type EndpointJobDefinition = AbstractJobDefinition & {
  job: (transactionId: string, data: unknown) => Promise<void>
}
type JobDefinition = AbstractJobDefinition & {
  job: () => Promise<void>
}
type BudgetJobDefinition = AbstractJobDefinition & {
  job: (budgetId: string) => Promise<void>
}

const startedAt = new Map<string, DateTime>()

const jobDefinitions: JobDefinition[] = [
  UpdateLeftoversBudgetLimit,
  UpdateBillsBudgetLimit,
  LinkPaypalTransactions,
]

const transactionJobDefinitions: TransactionJobDefinition[] = [
  UnbudgetedTransactions,
  UncategorizedTransactions,
]

const endpointJobDefinitions: EndpointJobDefinition[] = [
  SetTransactionAttributes,
]

const budgetJobDefinitions: BudgetJobDefinition[] = [
  CheckBudgetLimit,
  Init,
]

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
  const minutes = retryCount * 1
  const delayed = DateTime.now().plus({ minutes })
  const timestamp = delayed.toMillis()
  const title = err.message
  const message = [
    `Job **${job.data.job}** (${job.id}) failed with error ${err.message}.`,
    `Attempt: ${retryCount}`,
    `Delaying until ${delayed.toISOTime()} with data ${JSON.stringify(job.data)}.`,
  ].join("\n")
  const delayedMessageId = await notifier.sendMessageImpl(title, message)

  logger.info("Delaying job %s (%s) until %s - Attempt: %d", job.id, job.name, delayed.toISO(), retryCount)
  await job.updateData({ ...job.data, delayedMessageId, retryCount })
  await job.moveToDelayed(timestamp, job.token)
  throw new DelayedError("Job delayed due to error")
}

async function initializeWorker(): Promise<Worker<QueueArgs>> {
  if (worker) {
    return worker
  }

  const queue = await getQueue()

  // Clean up any stale jobs from previous runs
  queue.setGlobalConcurrency(1)
  await queue.pause()
  await queue.resume()

  const jobs: Record<string, (parameter?: string, data?: unknown) => Promise<void>> = {}

  worker = new Worker<QueueArgs>(
    "manager",
    async (job) => {
      try {
        const { data } = job
        await AboutService.getAbout()
        if (isTransactionJobArgs(data)) {
          await jobs[data.job](data.transactionId)
        } else if (isBudgetJobArgs(data)) {
          await jobs[data.job](data.budgetId)
        } else if (isEndpointJobArgs(data)) {
          await jobs[data.job](data.transactionId, data.data)
        } else {
          await jobs[data.job]()
        }
      } catch (err) {
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
    await addJobToQueue(Init.id, true)
  })

  for (const { job, id } of [...jobDefinitions, ...budgetJobDefinitions, ...transactionJobDefinitions, ...endpointJobDefinitions]) {
    jobs[id] = job
  }

  return worker
}

async function processExit() {
  if (worker) {
    await worker.close()
  }
}

process.on("SIGTERM", processExit)
process.on("SIGINT", processExit)

export { getQueue, initializeWorker, jobDefinitions, transactionJobDefinitions, budgetJobDefinitions }
