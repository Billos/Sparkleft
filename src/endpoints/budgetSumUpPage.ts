import { Request, Response } from "express"
import { autoImportPage } from "./autoImportPage"

export async function budgetSumUpPage(req: Request, res: Response) {
  await autoImportPage(req, res)
}
