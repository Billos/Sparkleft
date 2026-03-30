import { CategoriesService, TransactionRead, TransactionsService, TransactionTypeProperty } from "@firefly"
import pino from "pino"

import { client } from "../../client"
import { env } from "../../config"
import { notifier } from "../../modules/notifiers"
import { getBudgetName } from "../../utils/budgetName"
import { getDateNow } from "../../utils/date"
import { renderTemplate } from "../../utils/renderTemplate"
import { addTransactionJobToQueue } from "../utils"
import { TransactionJob } from "./BaseJob"

const logger = pino()

async function getUncategorizedTransactions(start?: string, end?: string): Promise<TransactionRead[]> {
  const transactions: TransactionRead[] = []
  const {
    data: {
      meta: {
        pagination: { total_pages },
      },
    },
  } = await TransactionsService.listTransaction({ client, query: { page: 1, limit: 200, start, end } })

  for (let page = 1; page <= total_pages; page++) {
    const {
      data: { data },
    } = await TransactionsService.listTransaction({ client, query: { page, limit: 200, start, end } })
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

  async run(id: string): Promise<void> {
    logger.info("Creating a new message for uncategorized transaction with key %s", id)
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

    if (transaction.category_id) {
      logger.info("Transaction %s already categorized", id)
      return
    }

    const billsBudgetName = await getBudgetName(env.billsBudgetId)
    const {
      data: { data: allCategories },
    } = await CategoriesService.listCategory({ client, query: { page: 1, limit: 50 } })
    const hiddenCategoriesSet = new Set(env.hiddenCategories)
    const categories = allCategories.filter(({ attributes: { name } }) => name !== billsBudgetName && !hiddenCategoriesSet.has(name))

    const msg = renderTemplate("uncategorized-transaction.njk", {
      transaction,
      transactionId: id,
      categories,
    })
    const messageId = await notifier.getMessageId("CategoryMessageId", id)
    if (messageId) {
      const messageExists = await notifier.hasMessageId(messageId)
      if (messageExists) {
        logger.info("Category message already exists for transaction %s", id)
        return
      }
      logger.info("Category message defined but not found in notifier for transaction %s", id)
    }
    await notifier.sendMessage("CategoryMessageId", msg, id)
  }

  override async init(): Promise<void> {
    logger.info("Initializing UnbudgetedTransactions jobs for all unbudgeted transactions")
    if (notifier) {
      const start = getDateNow().startOf("month").toISODate()
      const end = getDateNow().toISODate()
      const uncategorizedTransactionsList = await getUncategorizedTransactions(start, end)
      for (const { id: transactionId } of uncategorizedTransactionsList) {
        await addTransactionJobToQueue(this, transactionId)
      }
    }
    logger.info("Initialized UnbudgetedTransactions jobs for %d transactions", 0)
  }
}
