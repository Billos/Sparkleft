import { TransactionSplit, TransactionsService } from "@billos/firefly-iii-sdk"

import { client } from "../client"
import { MessageType } from "../modules/notifiers/notifier"

async function getTransaction(id: string): Promise<TransactionSplit> {
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

async function setNotes(transactionId: string, notes: string): Promise<void> {
  await TransactionsService.updateTransaction({
    client,
    path: { id: transactionId },
    body: { apply_rules: false, fire_webhooks: false, transactions: [{ notes }] },
  })
}

export async function bindTransactionToNotification(transactionId: string, messageType: MessageType, messageId: string): Promise<void> {
  const transaction = await getTransaction(transactionId)
  let notes = transaction.notes || ""
  if (!notes.includes(messageType)) {
    notes += `\n${messageType}: ${messageId}\n`
  } else {
    notes = notes.replace(new RegExp(`${messageType}: (\\d+)`), `${messageType}: ${messageId}`)
  }
  await setNotes(transactionId, notes)
}

export async function unbindTransactionToNotification(transactionId: string, messageType: MessageType, _messageId: string): Promise<void> {
  const transaction = await getTransaction(transactionId)
  const notes = (transaction.notes || "").replace(new RegExp(`${messageType}: (\\d+)`), "")
  await setNotes(transactionId, notes)
}
