import pino from "pino"

import { env } from "../../config"
import { BillsService, BudgetLimitStore, BudgetsService } from "../../types"
import { getDateNow } from "../../utils/date"
import { JobIds } from "../constants"
import { addJobToQueue } from "../jobs"
import { SimpleJob } from "./BaseJob"

const logger = pino()

async function getTotalAmountOfBills(startDate: string, endDate: string): Promise<number> {
  const allBills = await BillsService.listBill(null, 50, 1, startDate, endDate)
  // Filtering inactive bills
  const bills = allBills.data.filter(({ attributes }) => attributes.active)
  const paidBills = bills.filter(({ attributes: { paid_dates } }) => paid_dates.length > 0)
  const unpaidBills = bills
    .filter(({ attributes: { paid_dates } }) => paid_dates.length === 0)
    .filter(({ attributes: { next_expected_match } }) => !!next_expected_match)

  const maximumUnpaidBill = unpaidBills.reduce((acc, bill) => acc + parseFloat(bill.attributes.amount_max), 0)
  let paidBillsValue = 0
  for (const bill of paidBills) {
    const { data: transactions } = await BillsService.listTransactionByBill(bill.id, null, 50, 1, startDate, endDate)
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

class UpdateBillsBudgetLimitJob extends SimpleJob {
  readonly id = JobIds.UPDATE_BILLS_BUDGET_LIMIT

  async run(): Promise<void> {
    if (!env.billsBudgetId) {
      logger.warn("Bills budget name is not set in environment variables, skipping updateBillsBudgetLimit job")
      return
    }

    // Get all budgets
    const startDate = getDateNow().startOf("month").toISODate()
    const endDate = getDateNow().endOf("month").toISODate()

    const total = await getTotalAmountOfBills(startDate, endDate)

    const existingLimits = await BudgetsService.listBudgetLimitByBudget(env.billsBudgetId, null, startDate, endDate)

    if (existingLimits.data.length > 1) {
      throw new Error("There are more than one limit for the bills budget")
    }

    const params: BudgetLimitStore = {
      amount: total.toString(),
      budget_id: env.billsBudgetId,
      start: startDate,
      end: endDate,
      fire_webhooks: false,
    }

    if (existingLimits.data.length === 0) {
      logger.info("There are no limits for the bills budget, creating budget limit")
      await BudgetsService.storeBudgetLimit(env.billsBudgetId, params)
      return
    }

    if (existingLimits.data[0].attributes.amount === params.amount) {
      logger.info("The bills budget limit is already up to date, no changes needed")
      return
    }

    const [limit] = existingLimits.data
    try {
      await BudgetsService.updateBudgetLimit(env.billsBudgetId, limit.id, params)
    } catch (err) {
      logger.error({ err }, "Error updating bills budget limit:")
    }
    logger.info("Bills budget limit updated")
  }

  override async init(): Promise<void> {
    logger.info("Initializing UpdateBillsBudgetLimit job")
    await addJobToQueue(this.id)
    logger.info("UpdateBillsBudgetLimit job initialized")
  }
}

export const updateBillsBudgetLimit = new UpdateBillsBudgetLimitJob()
