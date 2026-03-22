import { Job, JobsOptions } from "bullmq"
import { pino } from "pino"

import { BaseJob, BudgetJob, EndpointJob, TransactionJob } from "./jobs/BaseJob"
import { getQueue } from "./queue"

const logger = pino()

function queueConfig(delay: number): JobsOptions {
  return {
    removeOnComplete: false,
    removeOnFail: true,
    delay,
  }
}

export async function addTransactionJobToQueue(job: TransactionJob, transactionId: string): Promise<Job> {
  const queue = await getQueue()
  const delay = job.getStartDelay()
  logger.info("Adding job to queue: %s for transactionId: %s with delay: %d seconds", job.id, transactionId, delay / 1000)
  return queue.add(job.id, { job: job.id, transactionId }, queueConfig(delay))
}

export async function addEndpointJobToQueue(job: EndpointJob, transactionId: string, data: unknown): Promise<Job> {
  const queue = await getQueue()
  const delay = job.getStartDelay()
  logger.info("Adding endpoint job to queue: %s for transactionId: %s with delay: %d seconds", job.id, transactionId, delay / 1000)
  return queue.add(job.id, { job: job.id, transactionId, data }, queueConfig(delay))
}

export async function addBudgetJobToQueue(job: BudgetJob, budgetId: string): Promise<Job> {
  const queue = await getQueue()
  const delay = job.getStartDelay()
  logger.info("Adding job to queue: %s for budgetId: %s with delay: %d seconds", job.id, budgetId, delay / 1000)
  return queue.add(job.id, { job: job.id, budgetId }, queueConfig(delay))
}

export async function addJobToQueue(job: BaseJob, asap?: boolean): Promise<Job> {
  const queue = await getQueue()
  const delay = job.getStartDelay(asap)
  logger.info("Adding job to queue: %s with delay: %d seconds", job.id, delay / 1000)
  return queue.add(job.id, { job: job.id }, queueConfig(delay))
}
