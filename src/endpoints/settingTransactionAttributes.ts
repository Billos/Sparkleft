import { QueueEvents } from "bullmq"
import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { env } from "../config"
import { getQueue } from "../queues"
import { JobIds } from "../queues/constants"
import { addEndpointJobToQueue } from "../queues/jobs"

const logger = pino()

export async function settingTransactionAttributes(
  req: Request<{ transactionId: string; budget_id?: string; category_id?: string }>,
  _res: Response,
  next: NextFunction,
) {
  logger.info("=================================== Setting transaction attributes ===================================")
  const queue = await getQueue()
  const queueEvents = new QueueEvents(queue.name, { connection: env.redisConnection })
  const { transactionId, budget_id, category_id } = req.params

  const data: { budget_id?: string; category_id?: string } = {}
  if (budget_id) {
    data.budget_id = budget_id
  }
  if (category_id) {
    data.category_id = category_id
  }

  const job = await addEndpointJobToQueue(JobIds.SET_TRANSACTION_ATTRIBUTES, transactionId, data)
  await job.waitUntilFinished(queueEvents)
  next()
}
