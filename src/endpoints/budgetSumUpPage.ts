import { Request, Response } from "express"

export async function budgetSumUpPage(req: Request, res: Response) {
  res.render("auto-import", { token: req.query.api_token })
}
