import { Request, Response } from "express"
import pino from "pino"

import { env } from "../config"
import { CategoriesService, TransactionsService } from "../types"
import { getBudgetName } from "../utils/budgetName"
import { getTransactionShowLink } from "../utils/getTransactionShowLink"

const logger = pino()

export async function categoriesForTransaction(req: Request<{ transactionId: string }>, res: Response) {
  logger.info("=================================== Showing categories for transaction ===================================")
  const { transactionId } = req.params

  // Get all categories
  const { data: allCategories } = await CategoriesService.listCategory(null, 50, 1)

  // Filter out hidden categories
  const billsBudgetName = await getBudgetName(env.billsBudgetId)
  const categories = allCategories.filter(({ attributes: { name } }) => name !== billsBudgetName)

  const {
    data: {
      attributes: {
        transactions: [{ description, amount, currency_symbol: currency }],
      },
    },
  } = await TransactionsService.getTransaction(transactionId)

  res.render("set-category", {
    categories,
    transactionId,
    description,
    amount: Number(amount).toFixed(2),
    currency,
    transactionLink: getTransactionShowLink(transactionId),
    token: req.query.api_token,
  })
}
