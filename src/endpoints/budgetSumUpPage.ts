import { Request, Response } from "express"

export async function budgetSumUpPage(req: Request, res: Response) {
  res.render("budget-sumup", { token: req.query.api_token })
}
