import { Request, Response } from "express"
import pino from "pino"

import DynamicConfig, { VConfig } from "../modules/config/dynamic"
import { Notifiers } from "../modules/notifiers/types"

const logger = pino()

const valid = [
  VConfig.NotifierDiscordWebhook,
  VConfig.NotifierGotifyApplicationId,
  VConfig.NotifierGotifyToken,
  VConfig.NotifierGotifyUrl,
  VConfig.NotifierGotifyUserToken,
]

function isNotifierField(value: string): value is VConfig {
  return valid.includes(value as VConfig)
}

export async function setNotifierField(req: Request<{ field: Notifiers }, unknown, { value: string }>, res: Response) {
  const { field } = req.params
  const { value } = req.body
  logger.info("=================================== Setting Notifier Field ===================================")

  if (!isNotifierField(field)) {
    logger.error("Invalid notifier field %s", field)
    return res.status(400).send({ message: "Invalid notifier field" })
  }

  logger.info("Setting notifier field %s", field)
  await DynamicConfig.set(field, value)
  return res.status(201).send({ field, value })
}
