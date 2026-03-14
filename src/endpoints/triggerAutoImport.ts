import { QueueEvents } from "bullmq"
import { Request, Response } from "express"
import pino from "pino"

import { env } from "../config"
import { getQueue } from "../queues"
import { JobIds } from "../queues/constants"
import { addJobToQueue } from "../queues/jobs"

const logger = pino()

export async function triggerAutoImport(_req: Request, res: Response) {
  logger.info("=================================== Triggering auto-import ===================================")

  if (!env.importerUrl || !env.importDirectory || !env.autoImportSecret) {
    res.status(400).json({ message: "Auto-import is not configured (importerUrl, importDirectory, autoImportSecret are required)" })
    return
  }

  const queue = await getQueue()
  const queueEvents = new QueueEvents(queue.name, { connection: env.redisConnection })
  const job = await addJobToQueue(JobIds.AUTO_IMPORT)
  await job.waitUntilFinished(queueEvents)
  await queueEvents.close()
  res.status(200).json({ message: "Auto-import completed" })
}
