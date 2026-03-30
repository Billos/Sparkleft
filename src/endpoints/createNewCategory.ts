import { CategoriesService } from "@firefly"
import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { client } from "../client"

const logger = pino()

export async function createNewCategory(
  req: Request<{ category_id?: string }, {}, {}, { name: string }>,
  _res: Response,
  next: NextFunction,
) {
  logger.info("=================================== Creating new category ===================================")
  const { name } = req.query

  logger.info("Creating new category with name: %s", name)
  const { data: categories } = await CategoriesService.listCategory({ client, query: { page: 1, limit: 50 } })
  let category = categories.data.find(({ attributes }) => attributes.name === name)
  if (!category) {
    category = (await CategoriesService.storeCategory({ client, body: { name } })).data.data
    logger.info("Category with name %s created successfully", name)
  } else {
    logger.info("Category with name %s already exists, skipping creation", name)
  }

  req.params.category_id = category.id
  next()
}
