import pino from "pino"

import { env } from "../../config"
import { notifier } from "../../modules/notifiers"
import { CategoriesService, TransactionRead, TransactionsService, TransactionTypeProperty } from "../../types"
import { getBudgetName } from "../../utils/budgetName"
import { getDateNow } from "../../utils/date"
import { renderTemplate } from "../../utils/renderTemplate"
import { addTransactionJobToQueue } from "../utils"
import { TransactionJob } from "./BaseJob"

const logger = pino()

async function getUncategorizedTransactions(startDate?: string, endDate?: string): Promise<TransactionRead[]> {
  const transactions: TransactionRead[] = []
  const {
    meta: {
      pagination: { total_pages },
    },
  } = await TransactionsService.listTransaction(null, 200, 1, startDate, endDate)

  for (let page = 1; page <= total_pages; page++) {
    const { data } = await TransactionsService.listTransaction(null, 200, page, startDate, endDate)
    const filteredData = data.filter(
      (transaction) =>
        !transaction.attributes.transactions[0].category_id &&
        transaction.attributes.transactions[0].type === TransactionTypeProperty.WITHDRAWAL,
    )
    transactions.push(...filteredData)
  }
  return transactions
}

export class UncategorizedTransactionsJob extends TransactionJob {
  readonly id = "uncategorized-transactions"

  override readonly startDelay = 10

  async run(transactionId: string): Promise<void> {
    logger.info("Creating a new message for uncategorized transaction with key %s", transactionId)
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

    if (transaction.category_id) {
      logger.info("Transaction %s already categorized", transactionId)
      return
    }

    const billsBudgetName = await getBudgetName(env.billsBudgetId)
    const { data: allCategories } = await CategoriesService.listCategory(null, 50, 1)
    const hiddenCategoriesSet = new Set(env.hiddenCategories)
    const categories = allCategories.filter(({ attributes: { name } }) => name !== billsBudgetName && !hiddenCategoriesSet.has(name))

    const msg = renderTemplate("uncategorized-transaction.njk", {
      transaction,
      transactionId,
      categories,
    })
    const messageId = await notifier.getMessageId("CategoryMessageId", transactionId)
    if (messageId) {
      const messageExists = await notifier.hasMessageId(messageId)
      if (messageExists) {
        logger.info("Category message already exists for transaction %s", transactionId)
        return
      }
      logger.info("Category message defined but not found in notifier for transaction %s", transactionId)
    }
    await notifier.sendMessage("CategoryMessageId", msg, transactionId)
  }

  override async init(): Promise<void> {
    logger.info("Initializing UnbudgetedTransactions jobs for all unbudgeted transactions")
    if (notifier) {
      const startDate = getDateNow().startOf("month").toISODate()
      const endDate = getDateNow().toISODate()
      const uncategorizedTransactionsList = await getUncategorizedTransactions(startDate, endDate)
      for (const { id: transactionId } of uncategorizedTransactionsList) {
        await addTransactionJobToQueue(this, transactionId)
      }
    }
    logger.info("Initialized UnbudgetedTransactions jobs for %d transactions", 0)
  }
}
