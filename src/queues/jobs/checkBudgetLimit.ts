import pino from "pino"

import { env } from "../../config"
import { notifier } from "../../modules/notifiers"
import { BudgetLimitStore, BudgetSingle, BudgetsService } from "../../types"
import { getDateNow } from "../../utils/date"
import { renderTemplate } from "../../utils/renderTemplate"
import { JobIds } from "../constants"
import { addBudgetJobToQueue } from "../jobs"
import { BudgetJob } from "./BaseJob"

const logger = pino()

export class CheckBudgetLimitJob extends BudgetJob {
  readonly id = JobIds.CHECK_BUDGET_LIMIT

  override readonly startDelay = 5

  async run(budgetId: string): Promise<void> {
    if (!budgetId) {
      logger.error("No budgetId provided for CheckBudgetLimit job")
      return
    }
    const { data: budget }: BudgetSingle = await BudgetsService.getBudget(budgetId)
    if (budget.id === env.billsBudgetId) {
      logger.debug("Budget is Bills budget, skipping review of budget limit")
      return
    }
    if (budget.id === env.leftoversBudgetId) {
      logger.debug("Budget is Leftovers budget, skipping review of budget limit")

      return
    }

    logger.info("Reviewing budget limit for %s with id %s", budget.attributes.name, budget.id)

    const start = getDateNow().startOf("month").toISODate()
    const end = getDateNow().endOf("month").toISODate()
    const {
      data: [existingLimits],
    } = await BudgetsService.listBudgetLimitByBudget(budget.id, null, start, end)

    const currencySymbol = budget.attributes.currency_code === "EUR" ? "€" : "$"
    const spent = -parseFloat(existingLimits?.attributes.spent[0]?.sum || "0")
    const limit = parseFloat(existingLimits?.attributes.amount) || 0

    if (spent <= limit) {
      logger.info("Budget is within limit. Spent: %d, Limit: %d", spent, limit)
      return
    }

    logger.info("Budget is overspent! Spent: %d, Limit: %d", spent, limit)
    // Setting the limit to spent and sending a notification
    const params: BudgetLimitStore = { amount: spent.toString(), budget_id: budget.id, start, end, fire_webhooks: true }

    if (!existingLimits) {
      logger.info("No existing limits found, creating a new one")
      await BudgetsService.storeBudgetLimit(budget.id, params)
    } else {
      await BudgetsService.updateBudgetLimit(budget.id, existingLimits.id, params)
    }

    const title = "Warning"
    const message = renderTemplate("budget-overspent.njk", {
      budgetName: budget.attributes.name,
      spent,
      limit,
      currencySymbol,
    })
    await notifier.notify(title, message)
    return
  }

  override async init(): Promise<void> {
    logger.info("Initializing CheckBudgetLimit jobs for all budgets")
    const startDate = getDateNow().startOf("month").toISODate()
    const endDate = getDateNow().endOf("month").toISODate()
    const { data: budgets } = await BudgetsService.listBudget(null, 50, 1, startDate, endDate)
    for (const budget of budgets) {
      if (budget.id !== env.billsBudgetId && budget.id !== env.leftoversBudgetId) {
        await addBudgetJobToQueue(this, budget.id)
      }
    }
    logger.info("Initialized CheckBudgetLimit jobs for %d budgets", budgets.length)
  }
}
