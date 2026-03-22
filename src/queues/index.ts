import { DelayedError, Job, Worker } from "bullmq"
import { DateTime } from "luxon"
import pino from "pino"

import { env } from "../config"
import { notifier } from "../modules/notifiers"
import { AboutService } from "../types"
import { BaseJob, SimpleJob } from "./jobs/BaseJob"
import { budgetJobs, endpointJobs, simpleJobs, transactionJobs } from "./jobs/index"
import { getQueue } from "./queue"
import { BudgetJobArgs, EndpointJobArgs, isBudgetJob, isEndpointJob, isTransactionJob, QueueArgs, TransactionJobArgs } from "./queueArgs"

const logger = pino()

const startedAt = new Map<string, DateTime>()

const jobMap = new Map<string, BaseJob>([...simpleJobs, ...transactionJobs, ...endpointJobs, ...budgetJobs].map((j) => [j.id, j]))

let worker: Worker<QueueArgs> | null = null

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

async function initializeJobs(): Promise<void> {
  logger.info("Initializing job definitions")
  for (const instance of [...simpleJobs, ...transactionJobs, ...budgetJobs, ...endpointJobs]) {
    await instance.init()
  }
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
        if (isTransactionJob(jobInstance)) {
          await jobInstance.run((data as TransactionJobArgs).transactionId)
        } else if (isBudgetJob(jobInstance)) {
          await jobInstance.run((data as BudgetJobArgs).budgetId)
        } else if (isEndpointJob(jobInstance)) {
          await jobInstance.run((data as EndpointJobArgs).transactionId, (data as EndpointJobArgs).data)
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

  worker.on("ready", () => {
    logger.info("Worker is ready and connected to Redis")
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

export { initializeWorker, initializeJobs }

export { simpleJobs, transactionJobs, budgetJobs }

export { getQueue } from "./queue"
