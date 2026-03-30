import { TransactionsService } from "@billos/firefly-iii-sdk"
import pino from "pino"

import { client } from "../../client"
import { notifier } from "../../modules/notifiers"
import { TransactionJob } from "./BaseJob"

const logger = pino()

export class RemoveTransactionMessagesJob extends TransactionJob {
  readonly id = "remove-transaction-messages"

  override readonly startDelay = 15

  async run(id: string): Promise<void> {
    logger.info("Checking and removing messages for updated transaction %s", id)
    const {
      data: {
        data: {
          attributes: {
            transactions: [transaction],
          },
        },
      },
    } = await TransactionsService.getTransaction({ client, path: { id } })

    if (transaction.category_id) {
      const categoryMessageId = await notifier.getMessageId("CategoryMessageId", id)
      if (categoryMessageId) {
        logger.info("Removing category message %s for transaction %s", categoryMessageId, id)
        await notifier.deleteMessage("CategoryMessageId", categoryMessageId, id)
      }
    }

    if (transaction.budget_id) {
      const budgetMessageId = await notifier.getMessageId("BudgetMessageId", id)
      if (budgetMessageId) {
        logger.info("Removing budget message %s for transaction %s", budgetMessageId, id)
        await notifier.deleteMessage("BudgetMessageId", budgetMessageId, id)
      }
    }
  }
}
