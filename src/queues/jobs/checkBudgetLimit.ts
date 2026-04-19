import { BudgetLimitStoreWritable, BudgetsService } from "@billos/firefly-iii-sdk"
import pino from "pino"

import { client } from "../../client"
import { env } from "../../config"
import { notifier } from "../../modules/notifiers"
import { getEndOfCurrentMonth, getStartOfCurrentMonth } from "../../utils/date"
import { renderTemplate } from "../../utils/renderTemplate"
import { addBudgetJobToQueue } from "../utils"
import { BudgetJob } from "./BaseJob"

const logger = pino()

export class CheckBudgetLimitJob extends BudgetJob {
  readonly id = "check-budget-limit"

  override readonly startDelay = 5

  async run(budgetId: string): Promise<void> {
    if (!budgetId) {
      logger.error("No budgetId provided for CheckBudgetLimit job")
      return
    }
    const start = getStartOfCurrentMonth()
    const end = getEndOfCurrentMonth()

    const {
      data: { data: budget },
    } = await BudgetsService.getBudget({ client, path: { id: budgetId }, query: { start, end } })

    if (!budget) {
      logger.error("Budget with id %s not found", budgetId)
      return
    }

    if (budget.id === env.billsBudgetId) {
      logger.debug("Budget is Bills budget, skipping review of budget limit")
      return
    }
    if (budget.id === env.leftoversBudgetId) {
      logger.debug("Budget is Leftovers budget, skipping review of budget limit")

      return
    }

    logger.info("Reviewing budget limit for %s with id %s", budget.attributes.name, budget.id)

    const {
      data: {
        data: [existingLimits],
      },
    } = await BudgetsService.listBudgetLimitByBudget({ client, path: { id: budget.id }, query: { start, end } })

    const currencySymbol = budget.attributes.currency_code === "EUR" ? "€" : "$"
    const [{ sum }] = budget.attributes.spent || [{ sum: "0" }]
    const spent = -parseFloat(sum || "0")
    const limit = parseFloat(existingLimits?.attributes.amount ?? "0") || 0

    if (spent <= limit) {
      logger.info("Budget is within limit. Spent: %d, Limit: %d", spent, limit)
      return
    }

    logger.info("Budget is overspent! Spent: %d, Limit: %d", spent, limit)
    // Setting the limit to spent and sending a notification
    const body: BudgetLimitStoreWritable = { amount: spent.toString(), start, end, fire_webhooks: true }

    if (!existingLimits) {
      logger.info("No existing limits found, creating a new one")
      await BudgetsService.storeBudgetLimit({ client, path: { id: budget.id }, body })
    } else {
      await BudgetsService.updateBudgetLimit({ client, path: { id: budget.id, limitId: existingLimits.id }, body })
    }

    const title = "Warning"
    const message = renderTemplate("budget-overspent.njk", {
      budgetName: budget.attributes.name,
      spent,
      limit,
      currencySymbol,
    })
    await notifier.sendMessage(title, message)
    return
  }

  override async init(): Promise<void> {
    logger.info("Initializing CheckBudgetLimit jobs for all budgets")
    const start = getStartOfCurrentMonth()
    const end = getEndOfCurrentMonth()
    const {
      data: { data: budgets },
    } = await BudgetsService.listBudget({ client, query: { start, end, limit: 100 } })
    for (const budget of budgets) {
      if (budget.id !== env.billsBudgetId && budget.id !== env.leftoversBudgetId) {
        await addBudgetJobToQueue(this, budget.id)
      }
    }
    logger.info("Initialized CheckBudgetLimit jobs for %d budgets", budgets.length)
  }
}
