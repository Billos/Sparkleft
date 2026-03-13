import pino from "pino"

import { notifier } from "../../modules/notifiers"
import { TransactionsService } from "../../sdk/firefly/core"
import { JobIds } from "../constants"

const id = JobIds.SET_CATEGORY_FOR_TRANSACTION

const logger = pino()
interface JobData {
  category_id: string
}

async function job(transactionId: string, data: JobData) {
  const { category_id } = data
  logger.info("Setting category %s for transaction %s", category_id, transactionId)

  logger.info("Deleting notifier message")
  try {
    const messageId = await notifier.getMessageId("CategoryMessageId", transactionId)
    await notifier.deleteMessage("CategoryMessageId", messageId, transactionId)
  } catch (error) {
    logger.error("No notifier message to delete for transaction %s", transactionId)
  }

  logger.info("Update transaction")
  await TransactionsService.updateTransaction(transactionId, {
    apply_rules: true,
    fire_webhooks: false,
    transactions: [{ category_id }],
  })
}

async function init() {}

export { job, init, id }
