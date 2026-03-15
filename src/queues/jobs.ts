import { Job, JobsOptions } from "bullmq"
import { pino } from "pino"

import { getQueue } from "."
import { JobIds } from "./constants"
import { getJobDelay } from "./delay"

const logger = pino()

function queueConfig(job: JobIds): JobsOptions {
  return {
    removeOnComplete: false,
    removeOnFail: true,
    delay: getJobDelay(job, false),
  }
}

export async function addTransactionJobToQueue(job: JobIds, transactionId: string): Promise<Job> {
  const queue = await getQueue()
  const delay = getJobDelay(job, false)
  logger.info("Adding job to queue: %s for transactionId: %s with delay: %d seconds", job, transactionId, delay / 1000)
  return queue.add(job, { job, transactionId }, queueConfig(job))
}

export async function addEndpointJobToQueue(job: JobIds, transactionId: string, data: unknown): Promise<Job> {
  const queue = await getQueue()
  const delay = getJobDelay(job, false)
  logger.info("Adding endpoint job to queue: %s for transactionId: %s with delay: %d seconds", job, transactionId, delay / 1000)
  return queue.add(job, { job, transactionId, data }, queueConfig(job))
}

export async function addBudgetJobToQueue(job: JobIds, budgetId: string): Promise<Job> {
  const queue = await getQueue()
  const delay = getJobDelay(job, false)
  logger.info("Adding job to queue: %s for budgetId: %s with delay: %d seconds", job, budgetId, delay / 1000)
  return queue.add(job, { job, budgetId }, queueConfig(job))
}

export async function addJobToQueue(job: JobIds, asap?: boolean): Promise<Job> {
  const queue = await getQueue()
  const delay = getJobDelay(job, false, asap)
  logger.info("Adding job to queue: %s with delay: %d seconds", job, delay / 1000)
  return queue.add(job, { job }, queueConfig(job))
}
