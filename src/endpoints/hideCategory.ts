import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { redis as connection, hiddenCategoriesKey } from "../redis"

const logger = pino()

export async function hideCategory(req: Request<{ categoryName: string }>, _res: Response, next: NextFunction) {
  const { categoryName } = req.params
  logger.info("=================================== Hiding toggle category ===================================")
  const hiddenCategories = await connection.lrange(hiddenCategoriesKey, 0, -1)
  const isCategoryHidden = hiddenCategories.includes(categoryName)

  if (isCategoryHidden) {
    logger.info("Category with name %s is already hidden, removing from hidden categories", categoryName)
    await connection.lrem(hiddenCategoriesKey, 0, categoryName)
  } else {
    logger.info("Category with name %s is not hidden, adding to hidden categories", categoryName)
    await connection.rpush(hiddenCategoriesKey, categoryName)
  }

  next()
}
