import { Request, Response } from "express"
import pino from "pino"

import DynamicConfig, { AConfig } from "../modules/config/dynamic"

const logger = pino()

export async function hideCategory(req: Request<{ categoryName: string }>, res: Response) {
  const { categoryName } = req.params
  logger.info("=================================== Hiding toggle category ===================================")
  const hiddenCategories = await DynamicConfig.lrange(AConfig.HiddenCategories, 0, -1)
  const isCategoryHidden = hiddenCategories.includes(categoryName)

  if (isCategoryHidden) {
    logger.info("Category with name %s is already hidden, removing from hidden categories", categoryName)
    await DynamicConfig.lrem(AConfig.HiddenCategories, 0, categoryName)
    return res.status(202).send({})
  } else {
    logger.info("Category with name %s is not hidden, adding to hidden categories", categoryName)
    await DynamicConfig.rpush(AConfig.HiddenCategories, categoryName)
    return res.status(201).send({})
  }
}
