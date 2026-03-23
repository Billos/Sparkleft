/**
 * Example: Using a custom client per request
 *
 * When you manage multiple Firefly III instances (or multiple user tokens)
 * you can pass a dedicated `client` instance directly into any service call
 * instead of relying on the global singleton.
 */

import { createClient } from "@hey-api/client-axios";

import { AccountsService, TransactionsService } from "../index.js";

// Create a named client for each Firefly III instance / token
const primaryClient = createClient({
  auth: "PRIMARY_INSTANCE_TOKEN",
  baseURL: "https://firefly-primary.example.com/api",
});

const secondaryClient = createClient({
  auth: "SECONDARY_INSTANCE_TOKEN",
  baseURL: "https://firefly-secondary.example.com/api",
});

// Pass the desired client via the `client` option on every call
async function listAccountsFromBothInstances() {
  const [primary, secondary] = await Promise.all([
    AccountsService.listAccount({ query: { type: "asset" }, client: primaryClient }),
    AccountsService.listAccount({ query: { type: "asset" }, client: secondaryClient }),
  ]);

  console.log("Primary accounts:", primary.data?.data);
  console.log("Secondary accounts:", secondary.data?.data);
}

// Retrieve a transaction using the secondary instance's client
async function getTransactionFromSecondary(id: string) {
  const response = await TransactionsService.getTransaction({
    path: { id },
    client: secondaryClient,
  });
  console.log("Transaction:", response.data?.data);
}

await listAccountsFromBothInstances();
await getTransactionFromSecondary("42");
