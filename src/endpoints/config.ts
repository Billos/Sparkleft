import { readFileSync } from "fs"
import { join } from "path"

import { Request, Response } from "express"
import pino from "pino"

const logger = pino()

const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8")) as {
  name: string
  version: string
  description?: string
  author: string
  license: string
  repository?: string | { url: string }
}

export async function configEndpoint(_req: Request, res: Response) {
  logger.debug("Config endpoint called")
  return res
    .json({
      version: pkg.version,
    })
    .status(200)
}
