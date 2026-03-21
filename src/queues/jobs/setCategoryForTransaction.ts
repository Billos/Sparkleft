import pino from "pino"

import { notifier } from "../../modules/notifiers"
import { TransactionsService } from "../../types"
import { EndpointJob } from "./BaseJob"

const logger = pino()

interface JobData {
  category_id: string
}

export class SetCategoryForTransactionJob extends EndpointJob {
  readonly id = "set-category-for-transaction"

  async run(transactionId: string, data: unknown): Promise<void> {
    const { category_id } = data as JobData
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
}
