import { Request, Response } from "express"

export async function controlPage(req: Request, res: Response) {
  res.render("auto-import", {
    token: req.query.api_token,
  })
}

export const autoImportPage = controlPage
