import { Request, Response } from "express"
import pino from "pino"

import { JobIds } from "../queues/constants"
import { addJobToQueue } from "../queues/jobs"

const logger = pino()

export async function triggerAutoImport(_req: Request, res: Response) {
  logger.info("=================================== Triggering auto-import ===================================")
  await addJobToQueue(JobIds.AUTO_IMPORT)
  res.status(202).json({ message: "Auto-import job queued" })
}
