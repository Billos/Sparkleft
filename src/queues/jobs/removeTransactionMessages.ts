import pino from "pino"

import { notifier } from "../../modules/notifiers"
import { TransactionsService } from "../../types"
import { TransactionJob } from "./BaseJob"

const logger = pino()

export class RemoveTransactionMessagesJob extends TransactionJob {
  readonly id = "remove-transaction-messages"

  override readonly startDelay = 15

  async run(transactionId: string): Promise<void> {
    logger.info("Checking and removing messages for updated transaction %s", transactionId)
    const {
      data: {
        attributes: {
          transactions: [transaction],
        },
      },
    } = await TransactionsService.getTransaction(transactionId)

    if (transaction.category_id) {
      const categoryMessageId = await notifier.getMessageId("CategoryMessageId", transactionId)
      if (categoryMessageId) {
        logger.info("Removing category message %s for transaction %s", categoryMessageId, transactionId)
        await notifier.deleteMessage("CategoryMessageId", categoryMessageId, transactionId)
      }
    }

    if (transaction.budget_id) {
      const budgetMessageId = await notifier.getMessageId("BudgetMessageId", transactionId)
      if (budgetMessageId) {
        logger.info("Removing budget message %s for transaction %s", budgetMessageId, transactionId)
        await notifier.deleteMessage("BudgetMessageId", budgetMessageId, transactionId)
      }
    }
  }
}
