import { Request, Response } from "express"
import pino from "pino"

import DynamicConfig, { VConfig } from "../modules/config/dynamic"

const logger = pino()

export async function setLocale(req: Request<unknown, unknown, { locale: string }>, res: Response) {
  const { locale } = req.body
  logger.info("=================================== Setting Locale ===================================")

  logger.info("Setting locale field %s", locale)
  await DynamicConfig.set(VConfig.Locale, locale)
  return res.status(201).send({})
}
