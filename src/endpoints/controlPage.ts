import { BudgetsService, CategoriesService } from "@billos/firefly-iii-sdk"
import { Request, Response } from "express"

import { client } from "../client"
import { hiddenBudgetsKey, hiddenCategoriesKey, redis } from "../redis"

export async function controlPage(req: Request, res: Response) {
  const [{ data: budgets }, { data: categories }, hiddenBudgets, hiddenCategories] = await Promise.all([
    BudgetsService.listBudget({ client, query: { page: 1, limit: 50 } }),
    CategoriesService.listCategory({ client, query: { page: 1, limit: 50 } }),
    redis.lrange(hiddenBudgetsKey, 0, -1),
    redis.lrange(hiddenCategoriesKey, 0, -1),
  ])

  res.render("control", {
    token: req.query.api_token,
    budgets,
    categories,
    hiddenBudgets,
    hiddenCategories,
  })
}
