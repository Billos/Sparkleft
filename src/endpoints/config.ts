import { readFileSync } from "fs"
import { join } from "path"

import { BudgetRead, BudgetsService, CategoriesService, CategoryRead } from "@billos/firefly-iii-sdk"
import { Request, Response } from "express"
import pino from "pino"

import { client } from "../client"
import DynamicConfig, { AConfig, VConfig } from "../modules/config/dynamic"

export interface About {
  name: string
  version: string
  description: string
  author: string
  license: string
  repository: string
}

export interface Config {
  about: About
  token?: string
  assetsAccounts: AccountRead[]
  assetsAccountId: string | null
  budgets?: BudgetRead[]
  categories?: CategoryRead[]
  hiddenBudgets?: string[]
  hiddenCategories?: string[]
  billsBudgetId: string | null
  leftoversBudgetId: string | null
  autoImportCron?: string
  budgetSumUpCron?: string
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
    hiddenBudgets,
    hiddenCategories,
    billsBudgetId,
    leftoversBudgetId,
    autoImportCron,
    budgetSumUpCron,
  ] = await Promise.all([
    BudgetsService.listBudget({ client, query: { page: 1, limit: 50 } }),
    CategoriesService.listCategory({ client, query: { page: 1, limit: 50 } }),
    DynamicConfig.lrange(AConfig.HiddenBudgets, 0, -1),
    DynamicConfig.lrange(AConfig.HiddenCategories, 0, -1),
    DynamicConfig.get(VConfig.RoleBudgetBillsId),
    DynamicConfig.get(VConfig.RoleBudgetLeftoversId),
    DynamicConfig.get(VConfig.AutoImportCron),
    DynamicConfig.get(VConfig.BudgetSumUpCron),
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
    token: process.env.TOKEN,
    budgets,
    categories,
    hiddenBudgets,
    hiddenCategories,
    billsBudgetId,
    leftoversBudgetId,
    autoImportCron: autoImportCron ?? undefined,
    budgetSumUpCron: budgetSumUpCron ?? undefined,
  }

  return res.json(result).status(200)
}
