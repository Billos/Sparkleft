# @firefly

Type-safe SDK for the [Firefly III](https://www.firefly-iii.org/) API, generated from the official OpenAPI specification (v6.5.1).

Built on [`@hey-api/client-axios`](https://github.com/hey-api/openapi-ts), it provides strongly-typed service classes for every Firefly III endpoint.

---

## Using it from the root project

Because this package lives inside the monorepo (`src/sdk/firefly`), it is already wired
into the root project via a **TypeScript path alias** — no installation step required.

The alias is defined in the root [`tsconfig.json`](../../../tsconfig.json):

```jsonc
// tsconfig.json (root)
{
  "compilerOptions": {
    "paths": {
      "@firefly": ["./src/sdk/firefly/index.ts"]
    }
  }
}
```

You can import any exported service or type directly:

```ts
import { TransactionsService } from "@firefly";
import { BudgetsService }      from "@firefly";
```

> **Dev** – `tsx` (used by `yarn dev:server` / `yarn dev:worker`) picks up the alias via
> esbuild's tsconfig integration and resolves the TypeScript source directly.
>
> **Production** – `yarn build` (`tsc`) compiles the package to `build/sdk/firefly/`.
> The Dockerfile then wires a `node_modules/@firefly` symlink pointing at that compiled
> output so `node` can resolve the import at runtime.

---

## Installation (standalone / external use)

```bash
npm install @firefly @hey-api/client-axios
# or
yarn add @firefly @hey-api/client-axios
```

---

## Quick start

### 1. Configure the client

The SDK ships with a pre-configured singleton `client`. Override it with your own instance URL and personal access token before making any calls.

```ts
import { client } from "@firefly/client.gen.js";

client.setConfig({
  auth: "YOUR_PERSONAL_ACCESS_TOKEN",
  baseURL: "https://your-firefly-instance.example.com/api",
});
```

> **Tip** – generate a personal access token in Firefly III under **Profile → OAuth → Personal Access Tokens**.

---

### 2. List asset accounts

```ts
import { AccountsService } from "@firefly";

const response = await AccountsService.listAccount({
  query: { type: "asset" },
});

console.log(response.data?.data);
```

### 3. Search transactions

```ts
import { SearchService } from "@firefly";

const response = await SearchService.searchTransactions({
  query: { query: "grocery" },
});

console.log(response.data?.data);
```

### 4. Create a withdrawal

```ts
import { TransactionsService } from "@firefly";

const response = await TransactionsService.storeTransaction({
  body: {
    transactions: [
      {
        type: "withdrawal",
        date: "2024-01-15T12:00:00+00:00",
        amount: "42.00",
        description: "Grocery shopping",
        source_id: "1",           // your asset account ID
        destination_name: "Supermarket",
        currency_code: "EUR",
        category_name: "Food",
      },
    ],
  },
});

console.log(response.data?.data);
```

### 5. Create a budget and set a monthly limit

```ts
import { BudgetsService } from "@firefly";

// Create the budget
const budget = await BudgetsService.storeBudget({
  body: { name: "Groceries" },
});
const budgetId = budget.data?.data?.id!;

// Attach a monthly spending limit
await BudgetsService.storeBudgetLimit({
  path: { id: budgetId },
  body: {
    start: "2024-01-01",
    end: "2024-01-31",
    amount: "300.00",
    currency_code: "EUR",
    period: "monthly",
  },
});
```

### 6. Use multiple Firefly III instances

When you need to talk to more than one Firefly III instance you can pass a dedicated `client` to any service call:

```ts
import { createClient } from "@hey-api/client-axios";
import { AccountsService } from "@firefly";

const instanceA = createClient({
  auth: "TOKEN_A",
  baseURL: "https://firefly-a.example.com/api",
});

const instanceB = createClient({
  auth: "TOKEN_B",
  baseURL: "https://firefly-b.example.com/api",
});

const [a, b] = await Promise.all([
  AccountsService.listAccount({ query: { type: "asset" }, client: instanceA }),
  AccountsService.listAccount({ query: { type: "asset" }, client: instanceB }),
]);
```

---

## Available services

| Service | Description |
|---|---|
| `AboutService` | Server version and cron info |
| `AccountsService` | Asset, revenue, expense, and liability accounts |
| `AttachmentsService` | File attachments |
| `AutocompleteService` | Lightweight autocomplete endpoints |
| `AvailableBudgetsService` | Available budgets per period |
| `BillsService` | Recurring bills |
| `BudgetsService` | Budgets and spending limits |
| `CategoriesService` | Transaction categories |
| `ChartsService` | Chart data for dashboards |
| `ConfigurationService` | Instance configuration |
| `CurrenciesService` | Currencies and exchange rates |
| `CurrencyExchangeRatesService` | Exchange rate management |
| `DataService` | Data export and bulk operations |
| `InsightService` | Spending/income insight data |
| `LinksService` | Transaction links |
| `ObjectGroupsService` | Object groups |
| `PiggyBanksService` | Piggy banks (savings goals) |
| `PreferencesService` | User preferences |
| `RecurrencesService` | Recurring transactions |
| `RuleGroupsService` | Rule groups |
| `RulesService` | Automation rules |
| `SearchService` | Full-text search |
| `SummaryService` | Basic financial summary |
| `TagsService` | Transaction tags |
| `TransactionsService` | Transactions (withdrawals, deposits, transfers) |
| `UserGroupsService` | User groups |
| `UsersService` | User management |
| `WebhooksService` | Webhook management |

---

## Regenerating the SDK

The source files in this directory (those ending in `.gen.ts`) are generated automatically from the Firefly III OpenAPI spec. To regenerate them, run the following command from the repository root:

```bash
yarn types:api:generate
```

The generation is configured in [`openapi-ts.config.ts`](../../../openapi-ts.config.ts).

---

## More examples

See the [`examples/`](./examples/) directory for runnable TypeScript examples covering common use-cases:

| File | Description |
|---|---|
| [`01-setup.ts`](./examples/01-setup.ts) | Client setup and configuration |
| [`02-accounts.ts`](./examples/02-accounts.ts) | Listing and creating accounts |
| [`03-transactions.ts`](./examples/03-transactions.ts) | Creating, searching, and updating transactions |
| [`04-budgets.ts`](./examples/04-budgets.ts) | Creating budgets and spending limits |
| [`05-multiple-clients.ts`](./examples/05-multiple-clients.ts) | Using multiple Firefly III instances |

---

## License

GPL-3.0-only – see [LICENSE](../../../LICENSE).
