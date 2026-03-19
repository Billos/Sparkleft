import pino from "pino"

import { env } from "../../config"
import { notifier } from "../../modules/notifiers"
import { BudgetsService, TransactionsService, TransactionTypeProperty } from "../../types"
import { getBudgetName } from "../../utils/budgetName"
import { renderTemplate } from "../../utils/renderTemplate"
import { JobIds } from "../constants"
import { addBudgetJobToQueue, addTransactionJobToQueue } from "../jobs"
import { TransactionJob } from "./BaseJob"
import { CheckBudgetLimitJob } from "./checkBudgetLimit"

const logger = pino()

export class UnbudgetedTransactionsJob extends TransactionJob {
  readonly id = JobIds.UNBUDGETED_TRANSACTIONS

  override readonly startDelay = 5

  async run(transactionId: string): Promise<void> {
    logger.info("Creating a new message for unbudgeted transaction with key %s", transactionId)
    const {
      data: {
        attributes: {
          transactions: [transaction],
        },
      },
    } = await TransactionsService.getTransaction(transactionId)

    // Ensure the transaction is a withdrawal
    const { type } = transaction
    if (type !== TransactionTypeProperty.WITHDRAWAL) {
      logger.info("Transaction %s is not a withdrawal", transactionId)
      return
    }
    if (!transaction) {
      logger.info("Transaction %s not found", transactionId)
      return
    }

    if (transaction.budget_id) {
      // We can assume that if a budget_id is set, the budget limit might need to be checked
      await addBudgetJobToQueue(new CheckBudgetLimitJob(), transaction.budget_id)
      logger.info("Transaction %s already budgeted", transactionId)
      return
    }

    const billsBudgetName = await getBudgetName(env.billsBudgetId)
    const { data: allBudgets } = await BudgetsService.listBudget(null, 50, 1)
    const budgets = allBudgets.filter(({ attributes: { name } }) => name !== billsBudgetName)

    const msg = renderTemplate("unbudgeted-transaction.njk", {
      transaction,
      transactionId,
      budgets,
    })
    const messageId = await notifier.getMessageId("BudgetMessageId", transactionId)
    if (messageId) {
      const messageExists = await notifier.hasMessageId(messageId)
      if (messageExists) {
        logger.info("Budget message already exists for transaction %s", transactionId)
        return
      }
      logger.info("Budget message defined but not found in notifier for transaction %s", transactionId)
    }
    await notifier.sendMessage("BudgetMessageId", msg, transactionId)
  }

  override async init(): Promise<void> {
    logger.info("Initializing UnbudgetedTransactions jobs for all unbudgeted transactions")
    if (notifier) {
      const { data } = await BudgetsService.listTransactionWithoutBudget(null, 50, 1)
      for (const { id: transactionId } of data) {
        await addTransactionJobToQueue(this, transactionId)
      }
    }
    logger.info("Initialized UnbudgetedTransactions jobs for %d transactions", 0)
  }
}
