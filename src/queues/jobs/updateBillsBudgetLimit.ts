import { BillsService, BudgetLimitStore, BudgetsService } from "@firefly"
import pino from "pino"

import { client } from "../../client"
import { env } from "../../config"
import { getDateNow } from "../../utils/date"
import { addJobToQueue } from "../utils"
import { SimpleJob } from "./BaseJob"

const logger = pino()

async function getTotalAmountOfBills(startDate: string, endDate: string): Promise<number> {
  const allBills = await BillsService.listBill({ client, query: { page: 1, limit: 50, start: startDate, end: endDate } })
  // Filtering inactive bills
  const bills = allBills.data.data.filter(({ attributes }) => attributes.active)
  const paidBills = bills.filter(({ attributes: { paid_dates } }) => paid_dates.length > 0)
  const unpaidBills = bills
    .filter(({ attributes: { paid_dates } }) => paid_dates.length === 0)
    .filter(({ attributes: { next_expected_match } }) => !!next_expected_match)

  const maximumUnpaidBill = unpaidBills.reduce((acc, bill) => acc + parseFloat(bill.attributes.amount_max), 0)
  let paidBillsValue = 0
  for (const bill of paidBills) {
    const {
      data: { data: transactions },
    } = await BillsService.listTransactionByBill({
      client,
      path: { id: bill.id },
      query: { page: 1, limit: 50, start: startDate, end: endDate },
    })
    for (const { attributes } of transactions) {
      for (const { amount } of attributes.transactions) {
        paidBillsValue += parseFloat(amount)
      }
    }
  }
  const total = paidBillsValue + maximumUnpaidBill
  logger.info("You have paid %d in bills", paidBillsValue)
  logger.info("You have at most %d in unpaid bills", maximumUnpaidBill)
  logger.info("Total bills value is at most %d", total)
  return total
}

export class UpdateBillsBudgetLimitJob extends SimpleJob {
  readonly id = "update-bills-budget-limit"

  override readonly startDelay = 15

  async run(): Promise<void> {
    if (!env.billsBudgetId) {
      logger.warn("Bills budget name is not set in environment variables, skipping updateBillsBudgetLimit job")
      return
    }

    // Get all budgets
    const startDate = getDateNow().startOf("month").toISODate()
    const endDate = getDateNow().endOf("month").toISODate()

    const total = await getTotalAmountOfBills(startDate, endDate)

    const { data: existingLimits } = await BudgetsService.listBudgetLimitByBudget({
      client,
      path: { id: env.billsBudgetId },
      query: { start: startDate, end: endDate },
    })

    if (existingLimits.data.length > 1) {
      throw new Error("There are more than one limit for the bills budget")
    }

    const body: BudgetLimitStore = {
      amount: total.toString(),
      budget_id: env.billsBudgetId,
      start: startDate,
      end: endDate,
      fire_webhooks: false,
    }

    if (existingLimits.data.length === 0) {
      logger.info("There are no limits for the bills budget, creating budget limit")
      await BudgetsService.storeBudgetLimit({ client, path: { id: env.billsBudgetId }, body })
      return
    }

    if (existingLimits.data[0].attributes.amount === body.amount) {
      logger.info("The bills budget limit is already up to date, no changes needed")
      return
    }

    const [limit] = existingLimits.data
    try {
      await BudgetsService.updateBudgetLimit({ client, path: { id: env.billsBudgetId, limitId: limit.id }, body })
    } catch (err) {
      logger.error({ err }, "Error updating bills budget limit:")
    }
    logger.info("Bills budget limit updated")
  }

  override async init(): Promise<void> {
    logger.info("Initializing UpdateBillsBudgetLimit job")
    await addJobToQueue(this)
    logger.info("UpdateBillsBudgetLimit job initialized")
  }
}
