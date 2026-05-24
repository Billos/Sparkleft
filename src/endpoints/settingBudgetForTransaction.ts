import { QueueEvents } from "bullmq"
import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { getQueue } from "../queues"
import { SetBudgetForTransactionJob } from "../queues/jobs/setBudgetForTransaction"
import { addEndpointJobToQueue } from "../queues/utils"
import { redis as connection } from "../redis"

const logger = pino()

export async function settingBudgetForTransaction(
  req: Request<{ transactionId: string; budget_id: string }>,
  _res: Response,
  next: NextFunction,
) {
  logger.info("=================================== Setting budget for transaction ===================================")
  const queue = await getQueue()
  const queueEvents = new QueueEvents(queue.name, { connection })
  const { transactionId, budget_id } = req.params

  const job = await addEndpointJobToQueue(new SetBudgetForTransactionJob(), transactionId, { budget_id })
  await job.waitUntilFinished(queueEvents)
  next()
}
