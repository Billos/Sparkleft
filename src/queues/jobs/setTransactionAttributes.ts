import pino from "pino"

import { notifier } from "../../modules/notifiers"
import { TransactionsService } from "../../types"
import { JobIds } from "../constants"

const id = JobIds.SET_TRANSACTION_ATTRIBUTES

const logger = pino()
interface JobData {
  budget_id?: string
  category_id?: string
}

async function job(transactionId: string, data: JobData) {
  const { budget_id, category_id } = data

  // Ensure at least one parameter is provided
  if (!budget_id && !category_id) {
    logger.warn("No budget_id or category_id provided for transaction %s, skipping update", transactionId)
    return
  }

  if (budget_id) {
    logger.info("Setting budget %s for transaction %s", budget_id, transactionId)

    logger.info("Deleting notifier message")
    try {
      const messageId = await notifier.getMessageId("BudgetMessageId", transactionId)
      await notifier.deleteMessage("BudgetMessageId", messageId, transactionId)
    } catch (error) {
      logger.error("No notifier message to delete for transaction %s", transactionId)
    }
  }

  if (category_id) {
    logger.info("Setting category %s for transaction %s", category_id, transactionId)

    logger.info("Deleting notifier message")
    try {
      const messageId = await notifier.getMessageId("CategoryMessageId", transactionId)
      await notifier.deleteMessage("CategoryMessageId", messageId, transactionId)
    } catch (error) {
      logger.error("No notifier message to delete for transaction %s", transactionId)
    }
  }

  logger.info("Update transaction")
  const transactionUpdate: { budget_id?: string; category_id?: string } = {}
  if (budget_id) {
    transactionUpdate.budget_id = budget_id
  }
  if (category_id) {
    transactionUpdate.category_id = category_id
  }

  await TransactionsService.updateTransaction(transactionId, {
    apply_rules: true,
    fire_webhooks: budget_id !== undefined,
    transactions: [transactionUpdate],
  })
}

async function init() {}

export { job, init, id }
