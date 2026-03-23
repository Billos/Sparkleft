/**
 * Example: Working with transactions
 *
 * List recent transactions, search, create a withdrawal, and update it.
 */

import { SearchService, TransactionsService } from "../index.js";

// ---- List the 10 most recent transactions --------------------------------
async function listRecentTransactions() {
  const response = await TransactionsService.listTransaction({
    query: { limit: 10, page: 1 },
  });
  console.log("Recent transactions:", response.data?.data);
}

// ---- Search transactions by description ---------------------------------
async function searchTransactions(query: string) {
  const response = await SearchService.searchTransactions({
    query: { query },
  });
  console.log("Matching transactions:", response.data?.data);
}

// ---- Create a withdrawal ------------------------------------------------
async function createWithdrawal() {
  const response = await TransactionsService.storeTransaction({
    body: {
      transactions: [
        {
          type: "withdrawal",
          date: "2024-01-15T12:00:00+00:00",
          amount: "42.00",
          description: "Grocery shopping",
          source_id: "1", // asset account ID
          destination_name: "Supermarket",
          currency_code: "EUR",
          category_name: "Food",
        },
      ],
    },
  });
  console.log("Created transaction:", response.data?.data);
}

// ---- Retrieve and then update a transaction ------------------------------
async function updateTransactionDescription(id: string, newDescription: string) {
  // Retrieve current state first
  const { data: current } = await TransactionsService.getTransaction({ path: { id } });
  const split = current?.data?.attributes?.transactions?.[0];

  if (!split) {
    throw new Error(`Transaction ${id} not found`);
  }

  const response = await TransactionsService.updateTransaction({
    path: { id },
    body: {
      transactions: [{ ...split, description: newDescription }],
    },
  });
  console.log("Updated transaction:", response.data?.data);
}

// Run examples
await listRecentTransactions();
await searchTransactions("grocery");
await createWithdrawal();
await updateTransactionDescription("123", "Weekly grocery shopping");
