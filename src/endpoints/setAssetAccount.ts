import { AccountsService, AccountTypeFilter } from "@billos/firefly-iii-sdk"
import { Request, Response } from "express"
import pino from "pino"

import { client } from "../client"
import DynamicConfig, { VConfig } from "../modules/config/dynamic"

const logger = pino()

export async function setCurrentAccount(req: Request<{ accountId: string }>, res: Response) {
  const { accountId } = req.params
  logger.info("=================================== Setting Current Account ===================================")

  const { data: assetAccounts } = await AccountsService.listAccount({ client, query: { type: AccountTypeFilter.ASSET } })

  const account = assetAccounts.find((account) => account.id === accountId)
  if (!account) {
    logger.error("Invalid account id %s", accountId)
    return res.status(400).send({ message: "Invalid account id" })
  }

  const currentId = await DynamicConfig.get(VConfig.CurrentAccountId)

  if (currentId === accountId) {
    logger.info("Account %s is already the current account, clearing it", accountId)
    await DynamicConfig.delete(VConfig.CurrentAccountId)
    return res.status(202).send({ accountId: "", selected: false })
  }

  logger.info("Setting account %s as the current account", accountId)
  await DynamicConfig.set(VConfig.CurrentAccountId, accountId)

  return res.status(201).send({ accountId, selected: true })
}
