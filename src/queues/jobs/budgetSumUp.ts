import { BudgetsService } from "@billos/firefly-iii-sdk"
import pino from "pino"

import { client } from "../../client"
import { notifier } from "../../modules/notifiers"
import { redis } from "../../redis"
import { getEndOfCurrentMonth, getStartOfCurrentMonth } from "../../utils/date"
import { renderTemplate } from "../../utils/renderTemplate"
import { BudgetSumUpData } from "../../utils/types/budgetSumUp"
import { SimpleJob } from "./BaseJob"

const logger = pino()

const BUDGET_SUMUP_NOTIFICATION_KEY = "sparkleft:notification:budget-sumup:id"

export class BudgetSumUpJob extends SimpleJob {
  readonly id = "budget-sum-up"

  override readonly retryable = false

  async run(): Promise<void> {
    const start = getStartOfCurrentMonth()
    const end = getEndOfCurrentMonth()

    const [allBudgets, allLimits] = await Promise.all([
      BudgetsService.listBudget({ client, query: { page: 1, limit: 50, start, end } }),
      BudgetsService.listBudgetLimit({ client, query: { start, end } }),
    ])

    const insights: BudgetSumUpData[] = []
    for (const budget of allBudgets.data.data) {
      const limit = allLimits.data.data.find(({ attributes: { budget_id } }) => budget_id === budget.id)
      if (!limit) {
        continue
      }
      const {
        attributes: { amount: budgetLimit = "0" },
      } = limit

      const {
        attributes: { name, currency_symbol: currency = "€", spent = [{ sum: "0" }] },
      } = budget

      const [spentValue] = spent
      const leftover = parseFloat(budgetLimit) + parseFloat(spentValue.sum || "0")

      insights.push({
        name,
        budgetLimit,
        spent: spentValue.sum || "0",
        leftover: String(leftover.toFixed(2)),
        currency,
      })
    }

    const previousNotificationId = await redis.get(BUDGET_SUMUP_NOTIFICATION_KEY)
    if (previousNotificationId) {
      logger.info("Deleting previous budget sum-up notification with ID %s", previousNotificationId)
      try {
        await notifier.deleteMessage(previousNotificationId)
      } catch (err) {
        logger.error({ err }, "Failed to delete previous budget sum-up notification with ID %s", previousNotificationId)
      }
    }

    const msg = renderTemplate("budget-sumup.njk", { insights })
    const notificationId = await notifier.sendMessage("Budgets Sum Up", msg)
    await redis.set(BUDGET_SUMUP_NOTIFICATION_KEY, notificationId)
  }
}
