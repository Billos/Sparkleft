import { TransactionSplit, TransactionsService } from "@firefly"
import pino from "pino"

import { client } from "../../client"

const logger = pino()
export type MessageType = "BudgetMessageId" | "CategoryMessageId" | "AlertMessage"

export interface Notifier {
  // Function about transactions
  getMessageId: (type: MessageType, transactionId: string) => Promise<string>
  // Generic function about messages
  notify: (title: string, message: string) => Promise<void>
  sendMessage: (type: MessageType, content: string, transactionId: string) => Promise<string>
  deleteMessage: (type: MessageType, id: string, transactionId: string) => Promise<void>
  deleteAllMessages: () => Promise<void>
  hasMessageId: (messageId: string) => Promise<boolean>
  // Functions about messages, implemented by the child class
  notifyImpl: (title: string, message: string) => Promise<void>
  sendMessageImpl: (title: string, message: string) => Promise<string>
  deleteMessageImpl: (id: string, transactionId: string) => Promise<void>
  deleteAllMessagesImpl: () => Promise<void>
  hasMessageIdImpl: (messageId: string) => Promise<boolean>
}

export abstract class AbstractNotifier implements Notifier {
  private getTitle(type: MessageType): string {
    switch (type) {
      case "CategoryMessageId":
        return "Uncategorized Transaction"
      case "BudgetMessageId":
        return "Unbudgeted Transaction"
      default:
        throw new Error(`Unknown message type: ${type}`)
    }
  }

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

  public async notify(title: string, message: string): Promise<void> {
    await this.notifyImpl(title, message)
  }

  private async setNotes(transactionId: string, notes: string): Promise<void> {
    await TransactionsService.updateTransaction({
      client,
      path: { id: transactionId },
      body: { apply_rules: false, fire_webhooks: false, transactions: [{ notes }] },
    })
  }

  private async setMessageId(type: MessageType, transactionId: string, messageId: string): Promise<void> {
    const transaction = await this.getTransaction(transactionId)
    // Notes might not include the HandlerMessageId yet
    let notes = transaction.notes || ""
    if (!notes.includes(type)) {
      notes += `\n${type}: ${messageId}\n`
    } else {
      notes = (transaction.notes || "").replace(new RegExp(`${type}: (\\d+)`), `${type}: ${messageId}`)
    }
    await this.setNotes(transactionId, notes)
  }

  private async unsetMessageId(type: MessageType, transactionId: string): Promise<void> {
    const transaction = await this.getTransaction(transactionId)
    const notes = (transaction.notes || "").replace(new RegExp(`${type}: (\\d+)`), "")
    await this.setNotes(transactionId, notes)
  }

  public async sendMessage(type: MessageType, content: string, transactionId: string): Promise<string> {
    const messageId = await this.sendMessageImpl(this.getTitle(type), content)
    await this.setMessageId(type, transactionId, messageId)
    return messageId
  }

  public async deleteMessage(type: MessageType, id: string, transactionId: string): Promise<void> {
    try {
      await this.unsetMessageId(type, transactionId)
    } catch (err) {
      logger.error({ err }, "Could not unset message ID for type %s and transaction %s:", type, transactionId)
      return
    }
    try {
      await this.deleteMessageImpl(id, transactionId)
    } catch (err) {
      logger.error({ err }, "Could not delete message for type %s and transaction %s:", type, transactionId)
    }
  }

  public async hasMessageId(messageId: string): Promise<boolean> {
    return this.hasMessageIdImpl(messageId)
  }

  public async deleteAllMessages(): Promise<void> {
    await this.deleteAllMessagesImpl()
  }

  abstract notifyImpl(title: string, message: string): Promise<void>

  abstract sendMessageImpl(title: string, content: string): Promise<string>

  abstract deleteMessageImpl(id: string, transactionId: string): Promise<void>

  abstract deleteAllMessagesImpl(): Promise<void>

  abstract hasMessageIdImpl(messageId: string): Promise<boolean>
}
