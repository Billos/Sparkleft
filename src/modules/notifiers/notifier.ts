import { TransactionSplit, TransactionsService } from "@billos/firefly-iii-sdk"
import pino from "pino"

import { client } from "../../client"

const logger = pino()
export type MessageType = "BudgetMessageId" | "CategoryMessageId" | "AutoImportMessage"

export interface Notifier {
  // Function about transactions
  getMessageId: (type: MessageType, transactionId: string) => Promise<string>
  // Generic function about messages
  sendMessage: (title: string, content: string) => Promise<string>
  deleteMessage: (id: string) => Promise<void>
  deleteAllMessages: () => Promise<void>
  hasMessageId: (messageId: string) => Promise<boolean>
  // Functions about messages, implemented by the child class
  sendMessageImpl: (title: string, message: string) => Promise<string>
  deleteMessageImpl: (id: string, transactionId: string) => Promise<void>
  deleteAllMessagesImpl: () => Promise<void>
  hasMessageIdImpl: (messageId: string) => Promise<boolean>
}

export abstract class AbstractNotifier implements Notifier {
  private async getTransaction(id: string): Promise<TransactionSplit> {
    const {
      data: {
        data: {
          attributes: {
            transactions: [transaction],
          },
        },
      },
    } = await TransactionsService.getTransaction({ client, path: { id } })
    return transaction
  }

  public async getMessageId(type: MessageType, transactionId: string): Promise<string> {
    const transaction = await this.getTransaction(transactionId)
    const regex = new RegExp(`${type}: (\\d+)`)
    const match = (transaction.notes || "").match(regex)
    if (match) {
      return match[1]
    }
    return null
  }

  public async sendMessage(title: string, content: string): Promise<string> {
    return this.sendMessageImpl(title, content)
  }

  public async deleteMessage(id: string): Promise<void> {
    try {
      await this.deleteMessageImpl(id, null)
    } catch (err) {
      logger.error({ err }, "Could not delete message with ID %s:", id)
    }
  }

  public async hasMessageId(messageId: string): Promise<boolean> {
    return this.hasMessageIdImpl(messageId)
  }

  public async deleteAllMessages(): Promise<void> {
    await this.deleteAllMessagesImpl()
  }

  abstract sendMessageImpl(title: string, content: string): Promise<string>

  abstract deleteMessageImpl(id: string, transactionId: string): Promise<void>

  abstract deleteAllMessagesImpl(): Promise<void>

  abstract hasMessageIdImpl(messageId: string): Promise<boolean>
}
