import { AccountsService, BudgetsService } from "@billos/firefly-iii-sdk"

import { client } from "../../client"
import DynamicConfig, { AConfig, VConfig } from "../../modules/config/dynamic"
import { getEndOfCurrentMonth, getStartOfCurrentMonth, getTodayDate } from "../../utils/date"
import { TemplateName } from "../../utils/renderTemplate"
import { BudgetSumUpData } from "../../utils/types/budgetSumUp"
import { SimpleJob } from "./BaseJob"

export class BudgetSumUpJob extends SimpleJob {
  readonly id = "budget-sum-up"

  override readonly retryable = false

  override readonly startDelay = 60

  override readonly uniqueNotificationKey = "sparkleft:notification:budget-sumup:id"

  override readonly cronConfigKey = VConfig.BudgetSumUpCron

  async run(): Promise<void> {
    const start = getStartOfCurrentMonth()
    const end = getEndOfCurrentMonth()

    const [allBudgets, allLimits] = await Promise.all([
      BudgetsService.listBudget({ client, query: { page: 1, limit: 50, start, end } }),
      BudgetsService.listBudgetLimit({ client, query: { start, end } }),
    ])

    const today = new Date().getDate()
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    const remainingDays = lastDayOfMonth - today + 1 // Include today in the count of remaining days

    const allInsights: BudgetSumUpData[] = []
    for (const budget of allBudgets.data) {
      const limit = allLimits.data.find(({ attributes: { budget_id } }) => budget_id === budget.id)
      if (!limit) {
        continue
      }
      const {
        attributes: { amount: budgetLimit = "0" },
      } = limit

      const {
        attributes: { name, currency_symbol: currency = "€", spent = [] },
      } = budget

      const spentValue = spent[0]?.sum || "0"
      const leftover = parseFloat(budgetLimit) + parseFloat(spentValue)

      allInsights.push({
        name,
        budgetLimit,
        spent: spentValue,
        leftover: String(leftover.toFixed(2)),
        leftPerDay: String((leftover / remainingDays).toFixed(2)),
        currency,
      })
    }

    const hiddenBudgets = await DynamicConfig.lrange(AConfig.HiddenBudgets, 0, -1)
    const insights = allInsights.filter(({ name }) => !hiddenBudgets.includes(name))

    const currentAccountId = await DynamicConfig.get(VConfig.CurrentAccountId)
    if (!currentAccountId) {
      throw new Error("Current account ID is not set in the configuration")
    }
    const currentAccount = await AccountsService.getAccount({ client, path: { id: currentAccountId } })
    const accountBalance = currentAccount.data.attributes.current_balance || "0"
    const accountCurrency = currentAccount.data.attributes.currency_symbol || "€"

    await this.sendUniqueNotification(TemplateName.BudgetSumUp, {
      insights,
      accountBalance,
      accountCurrency,
      remainingDays,
      startDay: getTodayDate(),
      endDay: end,
    })
  }
}
