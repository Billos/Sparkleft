import { Request, Response } from "express"

export async function autoImportPage(req: Request, res: Response) {
  res.render("auto-import", {
    token: req.query.api_token,
  })
}
