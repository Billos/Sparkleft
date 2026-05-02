import { AboutService, AccountsService, TransactionRead, TransactionTypeProperty } from "@billos/firefly-iii-sdk"
import pino from "pino"

import { client } from "../../client"
import { env } from "../../config"
import { getDateNow } from "../../utils/date"
import { SimpleJob } from "./BaseJob"

const logger = pino()

interface AccountTransactions {
  expenses: TransactionRead[]
  deposits: TransactionRead[]
}

export class AutoImportJob extends SimpleJob {
  readonly id = "auto-import"

  override readonly retryable = false // auto-import is triggered externally and should not be retried on failure

  override readonly uniqueNotificationKey = "sparkleft:notification:autoimport:id"

  override readonly cronPattern = env.autoImportCron

  private async getExpensesAndIncome(): Promise<AccountTransactions> {
    const start = getDateNow().minus({ days: 7 }).toISODate()!
    const end = getDateNow().toISODate()!

    const {
      data: { data: transactions },
    } = await AccountsService.listTransactionByAccount({
      client,
      path: { id: env.assetAccountId },
      query: { start, end },
    })
    const expenses = transactions.filter(({ attributes: { transactions } }) => transactions[0].type === TransactionTypeProperty.WITHDRAWAL)
    const deposits = transactions.filter(({ attributes: { transactions } }) => transactions[0].type === TransactionTypeProperty.DEPOSIT)
    return { expenses, deposits }
  }

  async run(): Promise<void> {
    if (!env.importerUrl || !env.importDirectory || !env.autoImportSecret) {
      logger.warn("Missing required configuration for auto-import job (importerUrl, importDirectory, autoImportSecret), skipping")
      return
    }

    const previousTransactions = await this.getExpensesAndIncome()
    logger.info(
      "Found %d transactions in the last 7 days for asset account",
      previousTransactions.expenses.length + previousTransactions.deposits.length,
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
    const diffExpenses = newTransactions.expenses.length - previousTransactions.expenses.length
    const diffDeposits = newTransactions.deposits.length - previousTransactions.deposits.length
    logger.info(
      "Found %d new transactions after auto-import (expenses: %d, income: %d)",
      diffExpenses + diffDeposits,
      diffExpenses,
      diffDeposits,
    )

    await this.sendUniqueNotification("Auto Import", "auto-import.njk", { diffExpenses, diffDeposits })
  }
}
