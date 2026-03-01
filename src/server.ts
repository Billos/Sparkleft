import { join } from "path"

import express from "express"
import pino from "pino"

import { env } from "./config"
import { categoriesForTransaction } from "./endpoints/categoriesForTransaction"
import { createNewCategory } from "./endpoints/createNewCategory"
import { settingBudgetForTransaction } from "./endpoints/settingBudgetForTransaction"
import { settingCategoryForTransaction } from "./endpoints/settingCategoryForTransaction"
import { webhook } from "./endpoints/webhook"
import { AssertTransactionExistsMiddleware } from "./utils/assertTransactionExistsMiddleware"
import { ParseBodyMiddleware } from "./utils/middleware"
import { TokenMiddleware } from "./utils/tokenMiddleware"
import { TransactionResultMiddleware } from "./utils/transactionResultMiddleware"
import { verifyWebhookMiddleware } from "./utils/webhookSecret"

const logger = pino()
const app = express()

const staticPath = join(__dirname, "public")
const templatesPath = join(__dirname, "templates")
logger.info("Serving static files from %s", staticPath)
logger.info("Serving templates from %s", templatesPath)

app.use("/public", express.static(staticPath))
app.set("views", templatesPath)
app.set("view engine", "pug")

app.use(ParseBodyMiddleware)

app.get(
  "/transaction/:transactionId/budget/:budget_id",
  TokenMiddleware,
  AssertTransactionExistsMiddleware,
  settingBudgetForTransaction,
  TransactionResultMiddleware,
)
app.get("/transaction/:transactionId/categories", TokenMiddleware, AssertTransactionExistsMiddleware, categoriesForTransaction)
app.get(
  "/transaction/:transactionId/category/:category_id",
  TokenMiddleware,
  AssertTransactionExistsMiddleware,
  settingCategoryForTransaction,
  TransactionResultMiddleware,
)
app.get(
  "/transaction/:transactionId/newCategory",
  TokenMiddleware,
  createNewCategory,
  settingCategoryForTransaction,
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
