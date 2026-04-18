import { QueueEvents } from "bullmq"
import { Request, Response } from "express"
import pino from "pino"

import { env } from "../config"
import { getQueue } from "../queues"
import { BudgetSumUpJob } from "../queues/jobs/budgetSumUp"
import { addJobToQueue } from "../queues/utils"

const logger = pino()

export async function triggerBudgetSumUp(_req: Request, res: Response) {
  logger.info("=================================== Triggering budget sum-up ===================================")

  if (!env.importerUrl || !env.importDirectory || !env.autoImportSecret) {
    res.status(400).json({ message: "Budget sum-up is not configured (importerUrl, importDirectory, autoImportSecret are required)" })
    return
  }

  const queue = await getQueue()
  const queueEvents = new QueueEvents(queue.name, { connection: env.redisConnection })
  try {
    const job = await addJobToQueue(new BudgetSumUpJob())
    await job.waitUntilFinished(queueEvents)
    res.status(200).json({ message: "Budget sum-up completed" })
  } catch (err) {
    logger.error({ err }, "Budget sum-up job failed")
    res.status(500).json({ message: "Budget sum-up job failed" })
  } finally {
    await queueEvents.close()
  }
}
