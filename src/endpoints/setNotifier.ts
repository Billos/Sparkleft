import { Request, Response } from "express"
import pino from "pino"

import DynamicConfig, { VConfig } from "../modules/config/dynamic"
import { Notifiers } from "../modules/notifiers/types"

const logger = pino()

function isNotifier(value: string): value is Notifiers {
  return Object.values(Notifiers).includes(value as Notifiers)
}

export async function setNotifier(req: Request<{ notifier: Notifiers }>, res: Response) {
  const { notifier } = req.params
  logger.info("=================================== Setting Notifier ===================================")

  if (!isNotifier(notifier)) {
    logger.error("Invalid notifier %s", notifier)
    return res.status(400).send({ message: "Invalid notifier" })
  }

  logger.info("Setting notifier %s", notifier)
  await DynamicConfig.set(VConfig.Notifier, notifier)
  return res.status(201).send({ notifier })
}
