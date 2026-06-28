import path from "path"

import { BudgetRead, CategoryRead, TransactionRead, TransactionSplit } from "@billos/firefly-iii-sdk"
import nunjucks from "nunjucks"

import { env } from "../config"
import { BudgetSumUpData } from "./types/budgetSumUp"

// Available notification templates. Each value matches a file in
// templates/notifications. Using an enum keeps template references type-safe
// and avoids stringly-typed template names spread across the codebase.
export enum TemplateName {
  AutoImport = "auto-import.njk",
  BudgetOverspent = "budget-overspent.njk",
  BudgetSumUp = "budget-sumup.njk",
  UnbudgetedTransaction = "unbudgeted-transaction.njk",
  UncategorizedTransaction = "uncategorized-transaction.njk",
}

// Each template has its own context shape describing exactly the variables it
// expects. The TemplateContextMap binds every TemplateName to its context, so
// renderTemplate can enforce that callers pass the right data per template.
export type AutoImportContext = {
  diffExpenses: number
  diffDeposits: number
  diffTransfers: number
  expenses: TransactionRead[]
  deposits: TransactionRead[]
  transfers: TransactionRead[]
  accountBalance: string
  accountCurrency: string
}

export type BudgetOverspentContext = {
  budgetName: string
  spent: number
  limit: number
  currencySymbol: string
}

export type BudgetSumUpContext = {
  insights: BudgetSumUpData[]
  accountBalance: string
  accountCurrency: string
}

export type UnbudgetedTransactionContext = {
  transaction: TransactionSplit
  transactionId: string
  budgets: BudgetRead[]
}

export type UncategorizedTransactionContext = {
  transaction: TransactionSplit
  transactionId: string
  categories: CategoryRead[]
  categoriesGroups: CategoryRead[][]
}

export type TemplateContextMap = {
  [TemplateName.AutoImport]: AutoImportContext
  [TemplateName.BudgetOverspent]: BudgetOverspentContext
  [TemplateName.BudgetSumUp]: BudgetSumUpContext
  [TemplateName.UnbudgetedTransaction]: UnbudgetedTransactionContext
  [TemplateName.UncategorizedTransaction]: UncategorizedTransactionContext
}

// Resolve the templates/notifications directory relative to this source file.
// __dirname is src/utils (tsx dev mode) or build/utils (compiled production mode).
// Going two levels up from either location reaches the project root, where
// templates/ lives alongside src/ and build/.
const templatesDir = path.join(__dirname, "..", "..", "templates", "notifications")

const njkEnv = nunjucks.configure(templatesDir, {
  // autoescape is intentionally disabled: the output is plain-text Markdown sent
  // to Discord / Gotify, not HTML. Enabling autoescape would corrupt Markdown
  // syntax (e.g. & → &amp;, < → &lt;) without providing any security benefit.
  autoescape: false,
  trimBlocks: true,
  lstripBlocks: true,
})

// Expose a subset of the application env config as a dedicated namespace in all templates.
// Only values that templates legitimately need are included; sensitive credentials
// (fireflyToken, webhookSecret, redis password, etc.) are intentionally excluded.
// Templates can reference these values as {{ env.fireflyUrl }}, {{ env.apiToken }}, etc.
njkEnv.addGlobal("env", {
  fireflyUrl: env.fireflyUrl,
  serviceUrl: env.serviceUrl,
  apiToken: env.apiToken,
})

njkEnv.addFilter("toFixed", (value: number | string, decimals: number) => {
  const num = parseFloat(String(value))
  return isNaN(num) ? String(value) : num.toFixed(decimals)
})

njkEnv.addFilter("UrlFireflyTransactionShow", (transactionId: string) => `${env.fireflyUrl}/transactions/show/${transactionId}`)

njkEnv.addFilter("UrlFireflyBudgets", () => `${env.fireflyUrl}/budgets`)

njkEnv.addFilter("UrlFireflyTransactions", () => `${env.fireflyUrl}/transactions/withdrawal`)

njkEnv.addFilter("UrlFireflyRules", () => `${env.fireflyUrl}/rules`)

njkEnv.addFilter(
  "UrlFireflyNewRule",
  (transaction: TransactionSplit) => `${env.fireflyUrl}/rules/create-from-journal/${transaction.transaction_journal_id}`,
)

njkEnv.addFilter(
  "UrlSparkleftCategorySet",
  (transactionId: string, categoryId: string) =>
    `${env.serviceUrl}/transaction/${transactionId}/category/${categoryId}?api_token=${env.apiToken}`,
)

njkEnv.addFilter(
  "UrlSparkleftBudgetSet",
  (transactionId: string, budgetId: string) =>
    `${env.serviceUrl}/transaction/${transactionId}/budget/${budgetId}?api_token=${env.apiToken}`,
)

njkEnv.addFilter(
  "UrlSparkleftCategorySetUI",
  (transactionId: string) => `${env.serviceUrl}/transaction/${transactionId}/categories?api_token=${env.apiToken}`,
)

njkEnv.addFilter("UrlSparkleftAutoImport", () => `${env.serviceUrl}/autoimport?api_token=${env.apiToken}`)

njkEnv.addFilter("UrlSparkleftBudgetSumUp", () => `${env.serviceUrl}/budget-sumup?api_token=${env.apiToken}`)

njkEnv.addFilter("UrlSparkleftControlPage", () => `${env.serviceUrl}/control?api_token=${env.apiToken}`)

njkEnv.addFilter("TransactionSummary", ({ attributes }: TransactionRead) => {
  try {
    const [{ amount, description, currency_symbol, currency_decimal_places }] = attributes.transactions
    const beforeDecimal = 4
    const pad = (currency_decimal_places ?? 0) + beforeDecimal
    return `${Number(amount).toFixed(currency_decimal_places).padStart(pad, "\u00A0")} ${currency_symbol} - ${description}`
  } catch (error) {
    return `Invalid transaction data: ${(error as Error).message}`
  }
})

export function renderTemplate<T extends TemplateName>(templateName: T, context: TemplateContextMap[T]): string {
  return njkEnv.render(templateName, context).trim()
}
