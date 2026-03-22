import { DateTime } from "luxon"
import pino from "pino"

import { env } from "../../config"
import { TransactionsService as PaypalTransactionsService, TransactionTypeProperty } from "../../paypalTypes"
import { TransactionsService } from "../../types"
import { getDateNow } from "../../utils/date"
import { addJobToQueue } from "../utils"
import { SimpleJob } from "./BaseJob"

const logger = pino()

export class LinkPaypalTransactionsJob extends SimpleJob {
  readonly id = "link-paypal-transactions"

  override readonly startDelay = 35

  async run(): Promise<void> {
    if (!env.fireflyPaypalAccountToken) {
      logger.info("No PayPal account token found, skipping job")
      return
    }
    // StartDate and EndDate are today - 20 days to today
    const startDate = getDateNow().minus({ days: 20 }).toISODate()
    const endDate = getDateNow().toISODate()

    // This function will retrieve the Paypal transactions that do not have the tag "Linked"
    const { data } = await PaypalTransactionsService.listTransaction(null, 50, 1, startDate, endDate)
    const unlinkedPaypalTransactions = data.filter(
      ({ attributes: { transactions } }) =>
        !transactions[0].tags.includes("Linked") && transactions[0].type === TransactionTypeProperty.WITHDRAWAL,
    )
    logger.info("Found %d Unlinked Paypal transactions", unlinkedPaypalTransactions.length)

    if (unlinkedPaypalTransactions.length === 0) {
      logger.info("No unlinked Paypal transactions found, exiting job")
      return
    }

    const { data: ffData } = await TransactionsService.listTransaction(null, 50, 1, startDate, endDate)
    // Filtering Firefly III transactions to only include those that do not have the tag "Linked" and have "PayPal" in the description
    const unlinkedFFTransactions = ffData.filter(
      ({ attributes: { transactions } }) => !transactions[0].tags.includes("Linked") && transactions[0].description.includes("PAYPAL"),
    )

    logger.info("Found %d Unlinked Firefly III transactions", unlinkedFFTransactions.length)

    if (unlinkedFFTransactions.length === 0) {
      logger.info("No unlinked Firefly III transactions found, exiting job")
      return
    }

    for (const paypalTransaction of unlinkedPaypalTransactions) {
      const [transaction] = paypalTransaction.attributes.transactions
      // It will retrieve the transactions that do not have the tag "Linked"
      if (transaction.tags.includes("Linked")) {
        continue
      }
      logger.info("Checking unlinked Paypal transaction %s - type: %s - %s", paypalTransaction.id, transaction.type, transaction.amount)
      // Getting the transactions from Firefly III each time to avoid having outdated data
      // Then it will try to find match the transaction with the Paypal transaction
      for (const {
        id,
        attributes: {
          transactions: [ffTransaction],
        },
      } of unlinkedFFTransactions) {
        //  - Amount should match
        if (ffTransaction.amount !== transaction.amount) {
          continue
        }

        // Date difference should be less than 5 days
        const ffTransactionDate = DateTime.fromISO(ffTransaction.date)
        const paypalTransactionDate = DateTime.fromISO(transaction.date)
        if (ffTransactionDate.diff(paypalTransactionDate, "days").days > 5) {
          continue
        }

        // Add Linked tag to both transactions
        // Add the destination_name of the Paypal transaction to the Firefly III transaction Notes
        logger.info("Linking paypal %s to Firefly III %s", transaction.destination_name, ffTransaction.description)
        await PaypalTransactionsService.updateTransaction(paypalTransaction.id, {
          apply_rules: false,
          fire_webhooks: false,
          transactions: [{ tags: [...transaction.tags, "Linked"] }],
        })
        await TransactionsService.updateTransaction(id, {
          apply_rules: true,
          fire_webhooks: false,
          transactions: [{ tags: [...ffTransaction.tags, "Linked"], notes: transaction.destination_name }],
        })
      }
    }
  }

  override async init(): Promise<void> {
    logger.info("Initializing LinkPaypalTransactions job")
    if (env.fireflyPaypalAccountToken) {
      await addJobToQueue(this)
    }
    logger.info("LinkPaypalTransactions job initialized")
  }
}
