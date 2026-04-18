import { Request, Response } from "express"

export async function controlPage(req: Request, res: Response) {
  res.render("control", {
    token: req.query.api_token,
  })
}
