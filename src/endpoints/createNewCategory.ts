import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { CategoriesService } from "../types"

const logger = pino()

export async function createNewCategory(
  req: Request<{ category_id?: string }, {}, {}, { name: string }>,
  _res: Response,
  next: NextFunction,
) {
  logger.info("=================================== Creating new category ===================================")
  const { name } = req.query

  logger.info("Creating new category with name: %s", name)
  const categories = await CategoriesService.listCategory(null, 50, 1)
  let category = categories.data.find(({ attributes }) => attributes.name === name)
  if (!category) {
    category = (await CategoriesService.storeCategory({ name })).data
    logger.info("Category with name %s created successfully", name)
  } else {
    logger.info("Category with name %s already exists, skipping creation", name)
  }

  req.params.category_id = category.id
  next()
}
