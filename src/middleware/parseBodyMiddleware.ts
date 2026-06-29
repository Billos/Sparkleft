import { NextFunction, Request, Response } from "express"

export function ParseBodyMiddleware(req: Request & { rawBody?: string }, _res: Response, next: NextFunction) {
  const chunks: Buffer[] = []

  req.on("data", (chunk) => {
    chunks.push(chunk)
  })

  req.on("end", () => {
    const buffer = Buffer.concat(chunks)

    req.rawBody = buffer.toString("utf8")
    req.body = JSON.parse(req.rawBody || "{}")

    next()
  })
}
