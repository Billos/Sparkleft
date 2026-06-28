import { readFileSync } from "fs"
import { join } from "path"

import { BudgetsService, CategoriesService } from "@billos/firefly-iii-sdk"
import { Request, Response } from "express"

import { client } from "../client"
import DynamicConfig, { AConfig, VConfig } from "../modules/config/dynamic"

const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8")) as { version: string }

export async function controlPage(req: Request, res: Response) {
  const [
    { data: budgets },
    { data: categories },
    hiddenBudgets,
    hiddenCategories,
    billsBudgetId,
    leftoversBudgetId,
  ] = await Promise.all([
    BudgetsService.listBudget({ client, query: { page: 1, limit: 50 } }),
    CategoriesService.listCategory({ client, query: { page: 1, limit: 50 } }),
    DynamicConfig.lrange(AConfig.HiddenBudgets, 0, -1),
    DynamicConfig.lrange(AConfig.HiddenCategories, 0, -1),
    DynamicConfig.get(VConfig.RoleBudgetBillsId),
    DynamicConfig.get(VConfig.RoleBudgetLeftoversId),
  ])

  res.render("control", {
    token: req.query.api_token,
    version: pkg.version,
    budgets,
    categories,
    hiddenBudgets,
    hiddenCategories,
    billsBudgetId,
    leftoversBudgetId,
  })
}
