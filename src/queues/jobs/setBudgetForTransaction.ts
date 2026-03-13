import pino from "pino"

import { notifier } from "../../modules/notifiers"
import { TransactionsService } from "../../sdk/firefly/core"
import { JobIds } from "../constants"

const id = JobIds.SET_BUDGET_FOR_TRANSACTION

const logger = pino()
interface JobData {
  budget_id: string
}

async function job(transactionId: string, data: JobData) {
  const { budget_id } = data
  logger.info("Setting budget %s for transaction %s", budget_id, transactionId)

  logger.info("Deleting notifier message")
  try {
    const messageId = await notifier.getMessageId("BudgetMessageId", transactionId)
    await notifier.deleteMessage("BudgetMessageId", messageId, transactionId)
  } catch (error) {
    logger.error("No notifier message to delete for transaction %s", transactionId)
  }

  logger.info("Update transaction")
  await TransactionsService.updateTransaction(transactionId, {
    apply_rules: true,
    fire_webhooks: true,
    transactions: [{ budget_id }],
  })
}

async function init() {}

export { job, init, id }
