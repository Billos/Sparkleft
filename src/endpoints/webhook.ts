import { Request, Response } from "express"
import pino from "pino"

import { BudgetProperties } from "../paypalTypes"
import { budgetJobs, transactionJobs } from "../queues"
import { LinkPaypalTransactionsJob } from "../queues/jobs/linkPaypalTransactions"
import { UpdateBillsBudgetLimitJob } from "../queues/jobs/updateBillsBudgetLimit"
import { UpdateLeftoverBudgetLimitJob } from "../queues/jobs/updateLeftoverBudgetLimit"
import { addBudgetJobToQueue, addJobToQueue, addTransactionJobToQueue } from "../queues/utils"
import { Transaction, WebhookTrigger } from "../types"

// type BudgetTriggers = WebhookTrigger.STORE_BUDGET | WebhookTrigger.UPDATE_BUDGET | WebhookTrigger.DESTROY_BUDGET | WebhookTrigger.STORE_UPDATE_BUDGET_LIMIT
// type TransactionTriggers = WebhookTrigger.STORE_TRANSACTION | WebhookTrigger.UPDATE_TRANSACTION | WebhookTrigger.DESTROY_TRANSACTION

type WebhookTransactionBody = {
  uuid: string
  user_id: number
  trigger: WebhookTrigger
  response: string
  url: string
  version: string
  content: (Transaction | BudgetProperties) & { id: number }
}

const transactionTriggers = [
  WebhookTrigger.ANY,
  WebhookTrigger.STORE_TRANSACTION,
  WebhookTrigger.UPDATE_TRANSACTION,
  WebhookTrigger.DESTROY_TRANSACTION,
]

const budgetTriggers = [
  WebhookTrigger.STORE_BUDGET,
  WebhookTrigger.UPDATE_BUDGET,
  WebhookTrigger.DESTROY_BUDGET,
  WebhookTrigger.STORE_UPDATE_BUDGET_LIMIT,
]

const logger = pino()

export async function webhook(req: Request, res: Response) {
  logger.info("=================================== Transaction webhook ===================================")
  const body: WebhookTransactionBody = req.body as WebhookTransactionBody
  logger.info("Received webhook with trigger: %s for content id: %d", body.trigger, body.content.id)

  const isTransactionTrigger = transactionTriggers.includes(body.trigger)
  const isBudgetTrigger = budgetTriggers.includes(body.trigger)

  if (isTransactionTrigger) {
    const transactionId = String(body.content.id)

    for (const job of transactionJobs) {
      await addTransactionJobToQueue(job, transactionId)
    }
  }

  if (isBudgetTrigger) {
    const budgetId = String(body.content.id)
    logger.info("Processing budget trigger for budget id: %o", body.content)
    for (const job of budgetJobs) {
      await addBudgetJobToQueue(job, budgetId)
    }
  }

  await addJobToQueue(new UpdateLeftoverBudgetLimitJob(), false)
  await addJobToQueue(new UpdateBillsBudgetLimitJob(), false)
  await addJobToQueue(new LinkPaypalTransactionsJob(), false)
  res.send("<script>window.close()</script>")
}
