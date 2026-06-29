import { Request, Response } from "express"

import { getTransactionShowLink } from "../utils/getTransactionShowLink"

export async function TransactionResultMiddleware(req: Request<{ transactionId: string }>, res: Response) {
  // Redirect to the transaction link
  const { transactionId } = req.params
  return res.redirect(getTransactionShowLink(transactionId))
}
