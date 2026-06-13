import { readFileSync } from "fs"
import { join } from "path"

import { BudgetsService, CategoriesService } from "@billos/firefly-iii-sdk"
import { Request, Response } from "express"

import { client } from "../client"
import { hiddenBudgetsKey, hiddenCategoriesKey, redis } from "../redis"

const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8")) as { version: string }

export async function controlPage(req: Request, res: Response) {
  const [{ data: budgets }, { data: categories }, hiddenBudgets, hiddenCategories] = await Promise.all([
    BudgetsService.listBudget({ client, query: { page: 1, limit: 50 } }),
    CategoriesService.listCategory({ client, query: { page: 1, limit: 50 } }),
    redis.lrange(hiddenBudgetsKey, 0, -1),
    redis.lrange(hiddenCategoriesKey, 0, -1),
  ])

  res.render("control", {
    token: req.query.api_token,
    version: pkg.version,
    budgets,
    categories,
    hiddenBudgets,
    hiddenCategories,
  })
}
