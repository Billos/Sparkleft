import { QueueEvents } from "bullmq"
import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { env } from "../config"
import { getQueue } from "../queues"
import { SetCategoryForTransactionJob } from "../queues/jobs/setCategoryForTransaction"
import { addEndpointJobToQueue } from "../queues/utils"

const logger = pino()

export async function settingCategoryForTransaction(
  req: Request<{ transactionId: string; category_id: string }>,
  _res: Response,
  next: NextFunction,
) {
  logger.info("=================================== Setting category for transaction ===================================")
  const queue = await getQueue()
  const queueEvents = new QueueEvents(queue.name, { connection: env.redisConnection })
  const { transactionId, category_id } = req.params

  const job = await addEndpointJobToQueue(new SetCategoryForTransactionJob(), transactionId, { category_id })
  await job.waitUntilFinished(queueEvents)
  next()
}
