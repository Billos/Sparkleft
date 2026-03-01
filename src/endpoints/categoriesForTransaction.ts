import { Request, Response } from "express"
import pino from "pino"

import { env } from "../config"
import { CategoriesService } from "../types"
import { getBudgetName } from "../utils/budgetName"

const logger = pino()

function escapeHtml(unsafe: string): string {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

export async function categoriesForTransaction(req: Request<{ transactionId: string }>, res: Response) {
  logger.info("=================================== Showing categories for transaction ===================================")
  const { transactionId } = req.params

  // Get all categories
  const { data: allCategories } = await CategoriesService.listCategory(null, 50, 1)

  // Filter out hidden categories
  const billsBudgetName = await getBudgetName(env.billsBudgetId)
  const categories = allCategories.filter(({ attributes: { name } }) => name !== billsBudgetName)

  // Get transaction details for display
  const transactionLink = escapeHtml(`${env.fireflyUrl?.replace("/api", "")}/transactions/show/${transactionId}`)

  res.render("set-category", {
    categories,
    transactionId,
    transactionLink,
    token: req.query.api_token,
  })
}
