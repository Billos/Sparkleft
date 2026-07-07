import { readFileSync } from "fs"
import { join } from "path"

import {
  AccountRead,
  AccountsService,
  AccountTypeFilter,
  BudgetRead,
  BudgetsService,
  CategoriesService,
  CategoryRead,
} from "@billos/firefly-iii-sdk"
import { Request, Response } from "express"
import pino from "pino"

import { client } from "../client"
import DynamicConfig, { AConfig, VConfig } from "../modules/config/dynamic"
import { Notifiers } from "../modules/notifiers/types"

export interface About {
  name: string
  version: string
  description: string
  author: string
  license: string
  repository: string
}

export interface NotifierConfig {
  discordWebhook: string | null
  gotifyUrl: string | null
  gotifyToken: string | null
  gotifyUserToken: string | null
  gotifyApplicationId: string | null
}

export interface Config {
  about: About
  token?: string
  assetAccounts: AccountRead[]
  currentAccountId: string | null
  budgets?: BudgetRead[]
  categories?: CategoryRead[]
  hiddenBudgets?: string[]
  hiddenCategories?: string[]
  billsBudgetId: string | null
  leftoversBudgetId: string | null
  autoImportCron?: string
  budgetSumUpCron?: string
  notifier: Notifiers
  notifierConfig: NotifierConfig
}

const logger = pino()

const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8")) as {
  name: string
  version: string
  description?: string
  author: string
  license: string
  repository?: string | { url: string }
}

function repositoryUrl(repo: typeof pkg.repository): string | undefined {
  if (!repo) return undefined
  const raw = typeof repo === "string" ? repo : repo.url
  return raw.replace(/^git\+/, "").replace(/\.git$/, "")
}

export async function configEndpoint(_req: Request, res: Response) {
  logger.debug("Config endpoint called")
  const [
    { data: budgets },
    { data: categories },
    { data: assetAccounts },
    hiddenBudgets,
    hiddenCategories,
    currentAccountId,
    billsBudgetId,
    leftoversBudgetId,
    autoImportCron,
    budgetSumUpCron,
    notifier,
    notifierDiscordWebhook,
    notifierGotifyUrl,
    notifierGotifyToken,
    notifierGotifyUserToken,
    notifierGotifyApplicationId,
  ] = await Promise.all([
    BudgetsService.listBudget({ client, query: { page: 1, limit: 50 } }),
    CategoriesService.listCategory({ client, query: { page: 1, limit: 50 } }),
    AccountsService.listAccount({ client, query: { type: AccountTypeFilter.ASSET } }),
    DynamicConfig.lrange(AConfig.HiddenBudgets, 0, -1),
    DynamicConfig.lrange(AConfig.HiddenCategories, 0, -1),
    DynamicConfig.get(VConfig.CurrentAccountId),
    DynamicConfig.get(VConfig.RoleBudgetBillsId),
    DynamicConfig.get(VConfig.RoleBudgetLeftoversId),
    DynamicConfig.get(VConfig.AutoImportCron),
    DynamicConfig.get(VConfig.BudgetSumUpCron),
    DynamicConfig.get(VConfig.Notifier),
    DynamicConfig.get(VConfig.NotifierDiscordWebhook),
    DynamicConfig.get(VConfig.NotifierGotifyUrl),
    DynamicConfig.get(VConfig.NotifierGotifyToken),
    DynamicConfig.get(VConfig.NotifierGotifyUserToken),
    DynamicConfig.get(VConfig.NotifierGotifyApplicationId),
  ])

  const result: Config = {
    about: {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description || "",
      author: pkg.author,
      license: pkg.license,
      repository: repositoryUrl(pkg.repository) || "",
    },
    assetAccounts,
    currentAccountId,
    token: process.env.TOKEN,
    budgets,
    categories,
    hiddenBudgets,
    hiddenCategories,
    billsBudgetId,
    leftoversBudgetId,
    autoImportCron: autoImportCron ?? undefined,
    budgetSumUpCron: budgetSumUpCron ?? undefined,
    notifier: notifier as Notifiers,
    notifierConfig: {
      discordWebhook: notifierDiscordWebhook,
      gotifyUrl: notifierGotifyUrl,
      gotifyToken: notifierGotifyToken,
      gotifyUserToken: notifierGotifyUserToken,
      gotifyApplicationId: notifierGotifyApplicationId,
    },
  }

  return res.json(result).status(200)
}
