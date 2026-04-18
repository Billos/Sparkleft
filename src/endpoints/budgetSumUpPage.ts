import { Request, Response } from "express"

export async function budgetSumUpPage(req: Request, res: Response) {
  const token = req.query.api_token
  res.redirect(`/autoimport?api_token=${token}`)
}
