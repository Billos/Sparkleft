import { TransactionsService, TransactionUpdateWritable } from "@firefly"
import pino from "pino"

import { client } from "../../client"
import { notifier } from "../../modules/notifiers"
import { EndpointJob } from "./BaseJob"

const logger = pino()

interface JobData {
  category_id: string
}

export class SetCategoryForTransactionJob extends EndpointJob {
  readonly id = "set-category-for-transaction"

  async run(id: string, data: unknown): Promise<void> {
    const { category_id } = data as JobData
    logger.info("Setting category %s for transaction %s", category_id, id)

    logger.info("Deleting notifier message")
    try {
      const messageId = await notifier.getMessageId("CategoryMessageId", id)
      await notifier.deleteMessage("CategoryMessageId", messageId, id)
    } catch (error) {
      logger.error("No notifier message to delete for transaction %s", id)
    }

    logger.info("Update transaction")
    const body: TransactionUpdateWritable = {
      apply_rules: true,
      fire_webhooks: false,
      transactions: [{ category_id }],
    }
    await TransactionsService.updateTransaction({ client, path: { id }, body })
  }
}
