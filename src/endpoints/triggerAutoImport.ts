import { QueueEvents } from "bullmq"
import { Request, Response } from "express"
import pino from "pino"

import { env } from "../config"
import { getQueue } from "../queues"
import { addJobToQueue } from "../queues/jobs"
import { AutoImportJob } from "../queues/jobs/autoImport"

const logger = pino()

export async function triggerAutoImport(_req: Request, res: Response) {
  logger.info("=================================== Triggering auto-import ===================================")

  if (!env.importerUrl || !env.importDirectory || !env.autoImportSecret) {
    res.status(400).json({ message: "Auto-import is not configured (importerUrl, importDirectory, autoImportSecret are required)" })
    return
  }

  const queue = await getQueue()
  const queueEvents = new QueueEvents(queue.name, { connection: env.redisConnection })
  try {
    const job = await addJobToQueue(new AutoImportJob())
    await job.waitUntilFinished(queueEvents)
    res.status(200).json({ message: "Auto-import completed" })
  } catch (err) {
    logger.error({ err }, "Auto-import job failed")
    res.status(500).json({ message: "Auto-import job failed" })
  } finally {
    await queueEvents.close()
  }
}
