import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { TransactionsService } from "../sdk/firefly/core"

const logger = pino()

export async function AssertTransactionExistsMiddleware(req: Request<{ transactionId: string }>, res: Response, next: NextFunction) {
  // Redirect to the transaction link
  const { transactionId } = req.params
  try {
    await TransactionsService.getTransaction(transactionId)
  } catch (err) {
    logger.error("Transaction not found for ID %s", transactionId)
    return res.status(404).send("Transaction not found")
  }
  return next()
}
