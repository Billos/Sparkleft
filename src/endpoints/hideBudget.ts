import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { redis as connection, hiddenBudgetsKey } from "../redis"

const logger = pino()

export async function hideBudget(req: Request<{ budgetName: string }>, _res: Response, next: NextFunction) {
  const { budgetName: budgetName } = req.params
  logger.info("=================================== Hiding toggle budget ===================================")
  const hiddenBudgets = await connection.lrange(hiddenBudgetsKey, 0, -1)
  const isBudgetHidden = hiddenBudgets.includes(budgetName)

  if (isBudgetHidden) {
    logger.info("Budget with name %s is already hidden, removing from hidden budgets", budgetName)
    await connection.lrem(hiddenBudgetsKey, 0, budgetName)
  } else {
    logger.info("Budget with name %s is not hidden, adding to hidden budgets", budgetName)
    await connection.rpush(hiddenBudgetsKey, budgetName)
  }

  next()
}
