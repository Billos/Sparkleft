import { TransactionsService, TransactionUpdateWritable } from "@billos/firefly-iii-sdk"
import pino from "pino"

import { client } from "../../client"
import { notifier } from "../../modules/notifiers"
import { unbindTransactionToNotification } from "../../utils/notification"
import { EndpointJob } from "./BaseJob"

const logger = pino()

interface JobData {
  budget_id: string
}

export class SetBudgetForTransactionJob extends EndpointJob {
  readonly id = "set-budget-for-transaction"

  async run(id: string, data: unknown): Promise<void> {
    const { budget_id } = data as JobData
    logger.info("Setting budget %s for transaction %s", budget_id, id)

    logger.info("Deleting notifier message")
    try {
      const messageId = await notifier.getMessageId("BudgetMessageId", id)
      await unbindTransactionToNotification(id, "BudgetMessageId", messageId)
      await notifier.deleteMessage(messageId)
    } catch (error) {
      logger.error("No notifier message to delete for transaction %s", id)
    }

    logger.info("Update transaction")

    const body: TransactionUpdateWritable = {
      apply_rules: true,
      fire_webhooks: true,
      transactions: [{ budget_id }],
    }
    await TransactionsService.updateTransaction({ client, path: { id }, body })
  }
}
