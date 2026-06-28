import { CategoriesService, TransactionsService } from "@billos/firefly-iii-sdk"
import { Request, Response } from "express"
import pino from "pino"

import { client } from "../client"
import DynamicConfig, { VConfig } from "../modules/config/dynamic"
import { getBudgetName } from "../utils/budgetName"
import { getTransactionShowLink } from "../utils/getTransactionShowLink"

const logger = pino()

export async function categoriesForTransaction(req: Request<{ transactionId: string }>, res: Response) {
  logger.info("=================================== Showing categories for transaction ===================================")
  const { transactionId } = req.params

  // Get all categories
  const { data: allCategories } = await CategoriesService.listCategory({ client, query: { page: 1, limit: 50 } })

  // Filter out hidden categories
  const billsBudgetId = await DynamicConfig.get(VConfig.RoleBudgetBillsId)
  if (!billsBudgetId) {
    throw new Error("Bills budget ID is not configured. Please set it in the environment variables or in Redis.")
  }
  const billsBudgetName = await getBudgetName(billsBudgetId)
  const categories = allCategories.filter(({ attributes: { name } }) => name !== billsBudgetName)

  const {
    data: {
      attributes: {
        transactions: [{ description, amount, currency_symbol: currency }],
      },
    },
  } = await TransactionsService.getTransaction({ client, path: { id: transactionId } })

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
