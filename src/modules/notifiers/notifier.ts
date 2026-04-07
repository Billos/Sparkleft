import { TransactionSplit, TransactionsService } from "@billos/firefly-iii-sdk"

import { client } from "../../client"

export type MessageType = "BudgetMessageId" | "CategoryMessageId" | "AutoImportMessage"

export interface Notifier {
  // Function about transactions
  getMessageId: (type: MessageType, transactionId: string) => Promise<string>
  // Generic function about messages
  sendMessage: (title: string, content: string) => Promise<string>
  deleteMessage: (id: string) => Promise<void>
  deleteAllMessages: () => Promise<void>
  hasMessageId: (messageId: string) => Promise<boolean>
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

  abstract sendMessage(title: string, content: string): Promise<string>

  abstract deleteMessage(id: string): Promise<void>

  abstract hasMessageId(messageId: string): Promise<boolean>

  abstract deleteAllMessages(): Promise<void>
}
