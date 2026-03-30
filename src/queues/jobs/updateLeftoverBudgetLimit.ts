import {
  AccountsService,
  BudgetLimitArray,
  BudgetLimitStore,
  BudgetRead,
  BudgetsService,
  InsightGroupEntry,
  InsightService,
} from "@firefly"
import pino from "pino"

import { client } from "../../client"
import { env } from "../../config"
import { getDateNow } from "../../utils/date"
import { addJobToQueue } from "../utils"
import { SimpleJob } from "./BaseJob"

const logger = pino()

async function getSumWithoutLeftovers(
  allBudgets: BudgetRead[],
  leftoversBudget: BudgetRead,
  allLimits: BudgetLimitArray,
  startDate: string,
  endDate: string,
): Promise<number> {
  const assetAccount = await AccountsService.getAccount({ client, path: { id: env.assetAccountId } })
  if (!assetAccount) {
    throw new Error("Asset account not found")
  }
  let leftoverAmount = Number.parseFloat(assetAccount.data.data.attributes.current_balance)
  logger.info("Current balance %d", leftoverAmount)

  const limitsWithoutLeftovers = allLimits.data.filter(({ attributes: { budget_id } }) => budget_id !== leftoversBudget.id)
  const budgetsIds = allLimits.data.map(({ attributes: { budget_id } }) => Number(budget_id))

  // const insightsRaw = await InsightService.insightExpenseBudget(startDate, endDate, null, budgetsIds)
  const { data: insightsRaw } = await InsightService.insightExpenseBudget({
    client,
    query: { start: startDate, end: endDate, "budgets[]": budgetsIds },
  })
  const insights: Record<string, InsightGroupEntry> = {}
  for (const insight of insightsRaw) {
    insights[insight.id] = insight
  }
  for (const limit of limitsWithoutLeftovers) {
    const {
      // attributes: { spent, budget_id, amount },
      attributes: { budget_id, amount },
    } = limit
    const insight = insights[budget_id]

    let spentValue = "0"
    const budget = allBudgets.find((b) => b.id === budget_id)!
    const { name } = budget.attributes
    if (insight) {
      spentValue = insight.difference
    }

    // const { data: budget } = await BudgetsService.getBudget(budget_id)
    // const spentValue = spent[0].sum || "0"
    // const name = budget.attributes.name
    const budgetLeftover = parseFloat(amount) + parseFloat(spentValue)
    logger.info("Subtracting %s - limit of %s - spent %s - Budget leftover %d", name, amount, spentValue, budgetLeftover)
    // A budget leftover might be negative, if the budget is overspent, this means it will be added to the leftover amount
    leftoverAmount -= Math.abs(budgetLeftover)
  }
  return leftoverAmount
}

export class UpdateLeftoverBudgetLimitJob extends SimpleJob {
  readonly id = "update-leftovers-budget-limit"

  override readonly startDelay = 25

  async run(): Promise<void> {
    const startDate = getDateNow().startOf("month").toISODate()
    const endDate = getDateNow().endOf("month").toISODate()

    const [allBudgets, allLimits] = await Promise.all([
      BudgetsService.listBudget({ client, query: { page: 1, limit: 50, start: startDate, end: endDate } }),
      BudgetsService.listBudgetLimit({ client, query: { start: startDate, end: endDate } }),
    ])
    const leftoversBudget = allBudgets.data.data.find(({ id }) => id === env.leftoversBudgetId)
    const leftOverLimit = allLimits.data.data.find(({ attributes: { budget_id } }) => budget_id === env.leftoversBudgetId)

    let leftoverAmount = await getSumWithoutLeftovers(allBudgets.data.data, leftoversBudget, allLimits.data, startDate, endDate)
    if (leftoverAmount < 0) {
      logger.info("Leftover amount is negative, setting to 0.1")
      leftoverAmount = 0.1
    }

    const currentLeftOverBudget = allBudgets.data.data.find(({ id }) => id === leftoversBudget.id)!
    const [spent] = currentLeftOverBudget.attributes.spent
    if (!spent) {
      logger.info("No spent amount found, setting it to 0")
    }
    const sum = spent?.sum || "0"

    const amount = String(-parseFloat(sum) + leftoverAmount)

    logger.info("Leftover amount %d", leftoverAmount)
    logger.info("Leftover spent %s", sum)
    logger.info("Budget limit should be %s", amount)

    if (parseFloat(amount) < 0) {
      logger.info("Amount is negative, stopping")
      return
    }

    if (amount === leftOverLimit?.attributes.amount) {
      logger.info("Amount is the same as the current limit, stopping")
      return
    }

    const body: BudgetLimitStore = { amount, budget_id: leftoversBudget.id, start: startDate, end: endDate, fire_webhooks: false }

    if (!leftOverLimit) {
      logger.info("No leftovers budget limit found, creating budget limit")
      await BudgetsService.storeBudgetLimit({ client, path: { id: leftoversBudget.id }, body })
      return
    }

    await BudgetsService.updateBudgetLimit({ client, path: { id: leftoversBudget.id, limitId: leftOverLimit.id }, body })
    logger.info("Leftovers budget limit updated")
  }

  override async init(): Promise<void> {
    logger.info("Initializing UpdateLeftoverBudgetLimit job")
    await addJobToQueue(this)
    logger.info("UpdateLeftoverBudgetLimit job initialized")
  }
}
