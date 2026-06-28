import { AboutService, AccountsService, TransactionRead, TransactionTypeProperty } from "@billos/firefly-iii-sdk"
import pino from "pino"

import { client } from "../../client"
import { env } from "../../config"
import { TemplateName } from "../../utils/renderTemplate"
import { SimpleJob } from "./BaseJob"

const logger = pino()

interface AccountTransactions {
  expenses: TransactionRead[]
  deposits: TransactionRead[]
  transfers: TransactionRead[]
}

export class AutoImportJob extends SimpleJob {
  readonly id = "auto-import"

  override readonly retryable = false // auto-import is triggered externally and should not be retried on failure

  override readonly uniqueNotificationKey = "sparkleft:notification:autoimport:id"

  override readonly cronPattern = env.autoImportCron

  private async getExpensesAndIncome(): Promise<AccountTransactions> {
    const now = new Date()
    const [start] = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().split("T")
    const [end] = now.toISOString().split("T")

    const { data: transactions } = await AccountsService.listTransactionByAccount({
      client,
      path: { id: env.assetAccountId },
      query: { start, end },
    })
    const expenses = transactions.filter(({ attributes: { transactions } }) => transactions[0].type === TransactionTypeProperty.WITHDRAWAL)
    const deposits = transactions.filter(({ attributes: { transactions } }) => transactions[0].type === TransactionTypeProperty.DEPOSIT)
    const transfers = transactions.filter(({ attributes: { transactions } }) => transactions[0].type === TransactionTypeProperty.TRANSFER)
    return { expenses, deposits, transfers }
  }

  async run(): Promise<void> {
    if (!env.importerUrl || !env.importDirectory || !env.autoImportSecret) {
      logger.warn("Missing required configuration for auto-import job (importerUrl, importDirectory, autoImportSecret), skipping")
      return
    }

    const previousTransactions = await this.getExpensesAndIncome()
    logger.info(
      "Found %d transactions in the last 7 days for asset account",
      previousTransactions.expenses.length + previousTransactions.deposits.length + previousTransactions.transfers.length,
    )

    if (env.fireflyCliToken) {
      logger.info("Triggering Firefly III cron job before auto-import")
      // await AboutService.getCron(env.fireflyCliToken)
      await AboutService.getCron({ client, path: { cliToken: env.fireflyCliToken } })
      logger.info("Firefly III cron job triggered successfully")
    } else {
      logger.warn("FIREFLY_III_CLI_TOKEN is not set, skipping Firefly III cron job trigger")
    }

    const params = new URLSearchParams()
    params.set("directory", env.importDirectory)
    params.set("secret", env.autoImportSecret)

    const url = `${env.importerUrl}/autoimport?${params.toString()}`
    logger.info("Triggering auto-import at %s/autoimport with directory: %s", env.importerUrl, env.importDirectory)
    const result = await fetch(url, { method: "POST" })
    if (!result.ok) {
      throw new Error(`Auto-import request failed with status ${result.status}: ${await result.text()}`)
    }
    logger.info("Auto-import triggered successfully")

    const newTransactions = await this.getExpensesAndIncome()

    const expenses = newTransactions.expenses.filter((newTx) => !previousTransactions.expenses.some((prevTx) => prevTx.id === newTx.id))
    const deposits = newTransactions.deposits.filter((newTx) => !previousTransactions.deposits.some((prevTx) => prevTx.id === newTx.id))
    const transfers = newTransactions.transfers.filter((newTx) => !previousTransactions.transfers.some((prevTx) => prevTx.id === newTx.id))
    const diffExpenses = newTransactions.expenses.length - previousTransactions.expenses.length
    const diffDeposits = newTransactions.deposits.length - previousTransactions.deposits.length
    const diffTransfers = newTransactions.transfers.length - previousTransactions.transfers.length
    logger.info(
      "Found %d new transactions after auto-import (expenses: %d, income: %d, transfers: %d)",
      diffExpenses + diffDeposits + diffTransfers,
      diffExpenses,
      diffDeposits,
      diffTransfers,
    )

    const assetAccount = await AccountsService.getAccount({ client, path: { id: env.assetAccountId } })

    await this.sendUniqueNotification("Auto Import", TemplateName.AutoImport, {
      diffExpenses,
      diffDeposits,
      diffTransfers,
      expenses,
      deposits,
      transfers,
      accountBalance: assetAccount.data.attributes.current_balance || "0",
      accountCurrency: assetAccount.data.attributes.currency_symbol || "€",
    })
  }
}
