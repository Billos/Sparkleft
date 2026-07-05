import express from "express"
import pino from "pino"

import { env } from "./config"
import { configEndpoint } from "./endpoints/config"
import { createNewCategory } from "./endpoints/createNewCategory"
import { hideBudget } from "./endpoints/hideBudget"
import { hideCategory } from "./endpoints/hideCategory"
import { setCurrentAccount } from "./endpoints/setAssetAccount"
import { setBudgetRole } from "./endpoints/setBudgetRole"
import { setCronConfig } from "./endpoints/setCronConfig"
import { settingBudgetForTransaction } from "./endpoints/settingBudgetForTransaction"
import { settingCategoryForTransaction } from "./endpoints/settingCategoryForTransaction"
import { triggerAutoImport } from "./endpoints/triggerAutoImport"
import { triggerBudgetSumUp } from "./endpoints/triggerBudgetSumUp"
import { webhook } from "./endpoints/webhook"
import { AssertTransactionExistsMiddleware } from "./middleware/assertTransactionExistsMiddleware"
import { ParseBodyMiddleware } from "./middleware/parseBodyMiddleware"
import { TokenMiddleware } from "./middleware/tokenMiddleware"
import { TransactionResultMiddleware } from "./middleware/transactionResultMiddleware"
import { verifyWebhookMiddleware } from "./middleware/webhookSecretMiddleware"
import { initializeJobs } from "./queues"

const logger = pino()
const app = express()

app.use("/public", express.static("public"))
app.set("views", "templates")

app.use(ParseBodyMiddleware)

app.get(
  "/transaction/:transactionId/budget/:budget_id",
  TokenMiddleware,
  AssertTransactionExistsMiddleware,
  settingBudgetForTransaction,
  TransactionResultMiddleware,
)
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

app.get(
  "/api/transaction/:transactionId/newCategory",
  TokenMiddleware,
  createNewCategory,
  settingCategoryForTransaction,
  TransactionResultMiddleware,
)
app.post("/api/budget-role/:role/:budgetId", TokenMiddleware, setBudgetRole)
app.post("/api/current-account/:accountId", TokenMiddleware, setCurrentAccount)
app.post("/api/hide-toggle/category/:categoryName", TokenMiddleware, hideCategory)
app.post("/api/hide-toggle/budget/:budgetName", TokenMiddleware, hideBudget)
app.post("/api/budget-sumup", TokenMiddleware, triggerBudgetSumUp)
app.post("/api/auto-import", TokenMiddleware, triggerAutoImport)
app.post("/api/cron/:type", TokenMiddleware, setCronConfig)
app.get("/api/config", TokenMiddleware, configEndpoint)

app.use("/control", express.static("dist/frontend"))

async function startServer() {
  try {
    await new Promise<void>((resolve) => {
      app.listen(env.port, () => {
        logger.info("Server is running on http://localhost:%s", env.port)
        resolve()
      })
    })
    await initializeJobs()
  } catch (err) {
    logger.error({ err }, "Failed to start server:")
    process.exit(1)
  }
}

startServer()
