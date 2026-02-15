import express from "express"
import pino from "pino"

import { env } from "./config"
import { settingTransactionAttributes } from "./endpoints/settingTransactionAttributes"
import { webhook } from "./endpoints/webhook"
import { AssertTransactionExistsMiddleware } from "./utils/assertTransactionExistsMiddleware"
import { ParseBodyMiddleware } from "./utils/middleware"
import { TokenMiddleware } from "./utils/tokenMiddleware"
import { TransactionResultMiddleware } from "./utils/transactionResultMiddleware"
import { verifyWebhookMiddleware } from "./utils/webhookSecret"

const logger = pino()
const app = express()

app.use(ParseBodyMiddleware)

app.get(
  "/transaction/:transactionId/budget/:budget_id",
  TokenMiddleware,
  AssertTransactionExistsMiddleware,
  settingTransactionAttributes,
  TransactionResultMiddleware,
)
app.get(
  "/transaction/:transactionId/category/:category_id",
  TokenMiddleware,
  AssertTransactionExistsMiddleware,
  settingTransactionAttributes,
  TransactionResultMiddleware,
)
app.post("/webhook", verifyWebhookMiddleware, webhook)

async function startServer() {
  try {
    app.listen(env.port, () => {
      logger.info("Server is running on http://localhost:%s", env.port)
    })
  } catch (err) {
    logger.error({ err }, "Failed to start server:")
    process.exit(1)
  }
}

startServer()
