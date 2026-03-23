/**
 * Example: Setting up the Firefly III SDK client
 *
 * This example shows how to initialise the SDK with your Firefly III instance
 * URL and personal access token.
 */

import { createClient } from "@hey-api/client-axios";

// Import the auto-configured singleton client (already initialised to the
// demo instance) and override it with your own settings.
import { client } from "../client.gen.js";

// --- Option 1: reconfigure the shared singleton --------------------------
client.setConfig({
  auth: "YOUR_PERSONAL_ACCESS_TOKEN",
  baseURL: "https://your-firefly-instance.example.com/api",
});

// --- Option 2: create a dedicated client (e.g. for a second account) ----
export const secondaryClient = createClient({
  auth: "SECONDARY_ACCOUNT_TOKEN",
  baseURL: "https://your-firefly-instance.example.com/api",
});

// The singleton `client` is used by default in every service call.
// Pass { client: secondaryClient } in the options object to use a different
// client for a specific request.
