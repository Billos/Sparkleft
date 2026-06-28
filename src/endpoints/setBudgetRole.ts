import { Request, Response } from "express"
import pino from "pino"

import DynamicConfig, { VConfig } from "../modules/config/dynamic"

const logger = pino()

enum BudgetRole {
  Bills = "bills",
  Leftovers = "leftovers",
}

function isBudgetRole(value: string): value is BudgetRole {
  return Object.values(BudgetRole).includes(value as BudgetRole)
}

export async function setBudgetRole(req: Request<{ role: string; budgetId: string }>, res: Response) {
  const { role, budgetId } = req.params
  logger.info("=================================== Setting budget role ===================================")

  if (!isBudgetRole(role)) {
    logger.error("Invalid budget role %s", role)
    return res.status(400).send({ message: "Invalid budget role" })
  }

  const key = role === BudgetRole.Bills ? VConfig.RoleBudgetBillsId : VConfig.RoleBudgetLeftoversId
  const currentId = await DynamicConfig.get(key)

  // Clicking the budget already assigned to the role unassigns it (toggle behaviour)
  if (currentId === budgetId) {
    logger.info("Budget %s is already the %s budget, clearing it", budgetId, role)
    await DynamicConfig.delete(key)
    return res.status(202).send({ role, budgetId: "", selected: false })
  }

  logger.info("Setting budget %s as the %s budget", budgetId, role)
  await DynamicConfig.set(key, budgetId)
  return res.status(201).send({ role, budgetId, selected: true })
}
