/**
 * Example: Working with budgets
 *
 * List budgets, get current spending, and create a budget with a limit.
 */

import { BudgetsService } from "../index.js";

// ---- List all budgets ---------------------------------------------------
async function listBudgets() {
  const response = await BudgetsService.listBudget({
    query: { page: 1 },
  });
  console.log("Budgets:", response.data?.data);
}

// ---- Create a new budget ------------------------------------------------
async function createBudget(name: string) {
  const response = await BudgetsService.storeBudget({
    body: { name },
  });
  console.log("Created budget:", response.data?.data);
  return response.data?.data?.id;
}

// ---- Set a monthly spending limit for a budget ---------------------------
async function setBudgetLimit(budgetId: string, amount: string, currencyCode: string) {
  const now = new Date();
  // First day of the current month
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  // Last day of the current month
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

  const response = await BudgetsService.storeBudgetLimit({
    path: { id: budgetId },
    body: {
      start,
      end,
      amount,
      currency_code: currencyCode,
      period: "monthly",
    },
  });
  console.log("Budget limit set:", response.data?.data);
}

// ---- List transactions belonging to a budget ----------------------------
async function listBudgetTransactions(budgetId: string) {
  const response = await BudgetsService.listTransactionByBudget({
    path: { id: budgetId },
    query: { page: 1 },
  });
  console.log("Budget transactions:", response.data?.data);
}

// Run examples
await listBudgets();
const newBudgetId = await createBudget("Groceries");
if (newBudgetId) {
  await setBudgetLimit(newBudgetId, "300.00", "EUR");
  await listBudgetTransactions(newBudgetId);
}
