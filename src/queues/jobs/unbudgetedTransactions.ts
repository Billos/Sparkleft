import { BudgetsService, TransactionsService, TransactionTypeProperty } from "@billos/firefly-iii-sdk"
import pino from "pino"

import { client } from "../../client"
import { env } from "../../config"
import { notifier } from "../../modules/notifiers"
import { getBudgetName } from "../../utils/budgetName"
import { bindTransactionToNotification } from "../../utils/notification"
import { renderTemplate } from "../../utils/renderTemplate"
import { addBudgetJobToQueue, addTransactionJobToQueue } from "../utils"
import { TransactionJob } from "./BaseJob"
import { CheckBudgetLimitJob } from "./checkBudgetLimit"

const logger = pino()

export class UnbudgetedTransactionsJob extends TransactionJob {
  readonly id = "unbudgeted-transactions"

  override readonly startDelay = 5

  async run(id: string): Promise<void> {
    logger.info("Creating a new message for unbudgeted transaction with key %s", id)
    const {
      data: {
        data: {
          attributes: {
            transactions: [transaction],
          },
        },
      },
    } = await TransactionsService.getTransaction({ client, path: { id } })

    // Ensure the transaction is a withdrawal
    const { type } = transaction
    if (type !== TransactionTypeProperty.WITHDRAWAL) {
      logger.info("Transaction %s is not a withdrawal", id)
      return
    }
    if (!transaction) {
      logger.info("Transaction %s not found", id)
      return
    }

    if (transaction.budget_id) {
      // We can assume that if a budget_id is set, the budget limit might need to be checked
      await addBudgetJobToQueue(new CheckBudgetLimitJob(), transaction.budget_id)
      logger.info("Transaction %s already budgeted", id)
      return
    }

    const billsBudgetName = await getBudgetName(env.billsBudgetId)
    const {
      data: { data: allBudgets },
    } = await BudgetsService.listBudget({ client, query: { page: 1, limit: 50 } })
    const budgets = allBudgets.filter(({ attributes: { name } }) => name !== billsBudgetName)

    const msg = renderTemplate("unbudgeted-transaction.njk", {
      transaction,
      transactionId: id,
      budgets,
    })
    const messageId = await notifier.getMessageId("BudgetMessageId", id)
    if (messageId) {
      const messageExists = await notifier.hasMessageId(messageId)
      if (messageExists) {
        logger.info("Budget message already exists for transaction %s", id)
        return
      }
      logger.info("Budget message defined but not found in notifier for transaction %s", id)
    }
    const newMessageId = await notifier.sendMessage("Unbudgeted Transaction", msg)
    await bindTransactionToNotification(id, "BudgetMessageId", newMessageId)
  }

  override async init(): Promise<void> {
    logger.info("Initializing UnbudgetedTransactions jobs for all unbudgeted transactions")
    if (notifier) {
      const {
        data: { data },
      } = await BudgetsService.listTransactionWithoutBudget({ client, query: { page: 1, limit: 50 } })
      for (const { id: transactionId } of data) {
        await addTransactionJobToQueue(this, transactionId)
      }
    }
    logger.info("Initialized UnbudgetedTransactions jobs for %d transactions", 0)
  }
}
