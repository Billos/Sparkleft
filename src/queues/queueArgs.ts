type JobArgs = { job: string; delayedMessageId?: string; retryCount?: number }
type EndpointJobArgs = { transactionId: string; data: unknown } & JobArgs
type TransactionJobArgs = { transactionId: string } & JobArgs
type BudgetJobArgs = { budgetId: string } & JobArgs
export function isTransactionJobArgs(args: QueueArgs): args is TransactionJobArgs {
  return (args as TransactionJobArgs).transactionId !== undefined && (args as EndpointJobArgs).data === undefined
}

export function isBudgetJobArgs(args: QueueArgs): args is BudgetJobArgs {
  return (args as BudgetJobArgs).budgetId !== undefined
}

export function isEndpointJobArgs(args: QueueArgs): args is EndpointJobArgs {
  return (args as EndpointJobArgs).data !== undefined
}

export type QueueArgs = TransactionJobArgs | BudgetJobArgs | EndpointJobArgs | JobArgs
