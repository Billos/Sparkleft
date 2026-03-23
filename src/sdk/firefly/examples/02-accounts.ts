/**
 * Example: Working with accounts
 *
 * List all asset accounts, retrieve a single account by ID, and create a
 * new expense account.
 */

import { AccountsService, AutocompleteService } from "../index.js";

// ---- List all asset accounts --------------------------------------------
async function listAssetAccounts() {
  const response = await AccountsService.listAccount({
    query: { type: "asset" },
  });
  console.log("Asset accounts:", response.data?.data);
}

// ---- Retrieve a single account by ID ------------------------------------
async function getAccount(id: string) {
  const response = await AccountsService.getAccount({ path: { id } });
  console.log("Account:", response.data?.data);
}

// ---- Autocomplete: search accounts by name ------------------------------
async function searchAccounts(query: string) {
  const response = await AutocompleteService.getAccountsAc({
    query: { query },
  });
  console.log("Matching accounts:", response.data);
}

// ---- Create a new expense account ----------------------------------------
async function createExpenseAccount(name: string, currencyCode: string) {
  const response = await AccountsService.storeAccount({
    body: {
      name,
      type: "expense",
      currency_code: currencyCode,
    },
  });
  console.log("Created account:", response.data?.data);
}

// Run examples
await listAssetAccounts();
await getAccount("1");
await searchAccounts("Cash");
await createExpenseAccount("Amazon", "EUR");
