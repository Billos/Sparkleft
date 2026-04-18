import { BudgetsService } from "@billos/firefly-iii-sdk"

import { client } from "../../client"
import { env } from "../../config"
import { getEndOfCurrentMonth, getStartOfCurrentMonth } from "../../utils/date"
import { BudgetSumUpData } from "../../utils/types/budgetSumUp"
import { SimpleJob } from "./BaseJob"

export class BudgetSumUpJob extends SimpleJob {
  readonly id = "budget-sum-up"

  override readonly retryable = false

  override readonly startDelay = 60

  override readonly uniqueNotificationKey = "sparkleft:notification:budget-sumup:id"

  async run(): Promise<void> {
    const start = getStartOfCurrentMonth()
    const end = getEndOfCurrentMonth()

    const [allBudgets, allLimits] = await Promise.all([
      BudgetsService.listBudget({ client, query: { page: 1, limit: 50, start, end } }),
      BudgetsService.listBudgetLimit({ client, query: { start, end } }),
    ])

    const allInsights: BudgetSumUpData[] = []
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

      allInsights.push({
        name,
        budgetLimit,
        spent: spentValue.sum || "0",
        leftover: String(leftover.toFixed(2)),
        currency,
      })
    }

    const insights = allInsights.filter(({ name }) => !env.hiddenBudgetsSumUp.includes(name))
    await this.sendUniqueNotification("Budgets Sum Up", "budget-sumup.njk", { insights })
  }
}
