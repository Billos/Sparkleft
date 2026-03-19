import pino from "pino"

import { notifier } from "../../modules/notifiers"
import { TransactionsService } from "../../types"
import { JobIds } from "../constants"
import { EndpointJob } from "./BaseJob"

const logger = pino()

interface JobData {
  budget_id: string
}

export class SetBudgetForTransactionJob extends EndpointJob {
  readonly id = JobIds.SET_BUDGET_FOR_TRANSACTION

  async run(transactionId: string, data: unknown): Promise<void> {
    const { budget_id } = data as JobData
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
}
