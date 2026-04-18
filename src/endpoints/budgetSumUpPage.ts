import { Request, Response } from "express"
import { controlPage } from "./autoImportPage"

export async function budgetSumUpPage(req: Request, res: Response) {
  await controlPage(req, res)
}
