import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { env } from "../config"

const logger = pino()

export async function TokenMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!env.useApiToken) {
    logger.debug("API token protection is disabled, skipping token verification")
    return next()
  }

  // Token is passed in the query parameters as ?api_token=...TOKEN
  const token = req.query.api_token as string | undefined
  logger.debug("Verifying API token")

  if (!token || token !== env.apiToken) {
    logger.error("Invalid or missing API token")
    await res.status(401).send("Unauthorized")
    return
  }
  return next()
}
