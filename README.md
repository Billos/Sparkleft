# Sparkleft

[![Coverage Report](https://img.shields.io/badge/coverage-report-blue)](https://billos.github.io/Sparkleft/)
[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-green)](LICENSE)

Budget management assistant for [Firefly III](https://www.firefly-iii.org/). Automatically categorises transactions, manages budget limits, links PayPal transactions, and sends notifications via Discord or Gotify.

## Features

- **Transaction categorisation** — Notifies when new uncategorised withdrawals appear, with interactive buttons to assign a category
- **Budget assignment** — Notifies when transactions need a budget, with buttons to assign one
- **Budget overspend detection** — Alerts when spending exceeds a budget limit
- **Dynamic budget limits** — Auto-calculates the bills budget (sum of paid bills + max of unpaid bills) and the leftovers budget (income − all other budgets)
- **PayPal linking** — Links PayPal transactions to Firefly III transactions across accounts
- **Auto-import** — Schedules or manually triggers transaction imports via the Firefly III Data Importer
- **Budget sum-up** — Generates a monthly budget summary report
- **Multi-channel notifications** — Discord webhook or Gotify support
- **Web dashboard** — Control panel to trigger jobs, hide/show budgets and categories
- **Cron scheduling** — Automatic job execution on a configurable schedule
- **Webhook integration** — Real-time triggers from Firefly III on transaction and budget events
- **Hidden items** — Hide unwanted budgets or categories from notification listings (persisted in Redis)

## Architecture

Sparkleft is split into three services communicating via a Redis-backed job queue ([BullMQ](https://docs.bullmq.io/)):

```
┌──────────────────────────────────┐
│  Express Server (port 3000)      │
│  HTTP API · Web UI · Job creator │
└──────────────┬───────────────────┘
               │  enqueue jobs
               ▼
       ┌───────────────┐
       │     Redis      │
       │  (BullMQ)      │
       └───────┬───────┘
               │  dequeue & process
               ▼
       ┌───────────────┐
       │    Worker      │
       │  Job processor │
       └───────────────┘
               │
               ▼
       ┌───────────────┐
       │ Firefly III API│
       └───────────────┘
```

- **Server** — Handles HTTP endpoints, serves the web UI, and enqueues jobs into Redis.
- **Worker** — Processes jobs from the queue (budget calculations, notifications, imports, etc.).
- **Redis** — Message broker between server and worker.

## Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 26, TypeScript |
| HTTP | Express 5 |
| Job queue | BullMQ + ioredis |
| Firefly III client | `@billos/firefly-iii-sdk` |
| Templates | Pug (UI), Nunjucks (notifications) |
| Logging | Pino |
| Date handling | Luxon |
| Testing | Vitest + v8 coverage |
| CI/CD | Semantic Release, Docker Hub |
| Package manager | Yarn 4 |

## Getting started

### Prerequisites

- A running [Firefly III](https://www.firefly-iii.org/) instance with API access
- Docker & Docker Compose **or** Node.js ≥ 26 with Yarn 4
- A Redis instance (provided by Docker Compose or external)
- The target budgets (bills, leftovers) must already exist in Firefly III with an initial limit set

### Configuration

Copy `.env.default` to `.env` and fill in the values:

```shell
# ─── Firefly III ─────────────────────────────────────────
FIREFLY_III_URL=              # Firefly III base URL including /api (e.g. https://firefly.example.com/api)
FIREFLY_III_TOKEN=            # Personal Access Token for the main account
FIREFLY_III_PAYPAL_ACCOUNT_TOKEN= # Token for the PayPal-linked account (optional)
FIREFLY_III_WEBHOOK_SECRET=   # Webhook signature secret configured in Firefly III
FIREFLY_III_CLI_TOKEN=        # CLI token used for triggering Firefly III cron jobs

# ─── API security ────────────────────────────────────────
API_TOKEN=                    # Token to protect Sparkleft endpoints
USE_API_TOKEN=                # Set to 'false' to disable token protection (default: true)

# ─── Budgets & accounts ─────────────────────────────────
BILLS_BUDGET_ID=              # ID of the bills budget in Firefly III
LEFTOVERS_BUDGET_ID=          # ID of the leftovers budget in Firefly III
ASSET_ACCOUNT_ID=             # ID of the main asset account

# ─── Notifications ───────────────────────────────────────
# Configure at least one channel: Discord or Gotify
DISCORD_WEBHOOK=              # Discord webhook URL
GOTIFY_URL=                   # Gotify instance URL
GOTIFY_APPLICATION_ID=        # Gotify application ID
GOTIFY_TOKEN=                 # Gotify application token
GOTIFY_USER_TOKEN=            # Gotify user token (for deleting messages)

# ─── Auto-import ─────────────────────────────────────────
IMPORTER_URL=                 # URL of the Firefly III Data Importer
IMPORT_DIRECTORY=             # Path to the import configuration directory
AUTO_IMPORT_SECRET=           # Secret for the auto-import endpoint
AUTO_IMPORT_CRON=             # Cron expression for scheduled auto-imports (optional)

# ─── Scheduling ──────────────────────────────────────────
BUDGET_SUM_UP_CRON=           # Cron expression for scheduled budget sum-ups (optional)

# ─── Redis ───────────────────────────────────────────────
REDIS_URL=                    # Redis connection URL (e.g. redis://redis:6379)

# ─── Other ───────────────────────────────────────────────
SERVICE_URL=                  # Public URL of this Sparkleft instance (used in notification links)
TZ=                           # Timezone (e.g. Europe/Paris)
```

### Running with Docker Compose (recommended)

**Production:**

```bash
docker compose up -d
```

This starts three services:

| Service | Role | Port |
|---------|------|------|
| `redis` | Message queue broker | — |
| `server` | HTTP API & web UI | 3000 |
| `worker` | Background job processor | — |

**Development (with hot-reload):**

```bash
docker compose -f docker-compose.dev.yml up
```

Source files are mounted as volumes — changes are picked up automatically.

### Running without Docker

```bash
# Install dependencies
yarn install

# Build
yarn build

# Start the server
yarn start:server

# Start the worker (in a separate terminal)
yarn start:worker
```

A Redis instance must be reachable at the URL specified in `REDIS_URL`.

## API endpoints

All endpoints are protected by the `API_TOKEN` when `USE_API_TOKEN` is enabled (default).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/about` | Application info page |
| `GET` | `/control` | Dashboard to trigger jobs and toggle hidden items |
| `GET` | `/budget-sumup` | Budget summary page |
| `POST` | `/budget-sumup` | Trigger a budget sum-up job |
| `GET` | `/autoimport` | Auto-import page |
| `POST` | `/autoimport` | Trigger an auto-import job |
| `GET` | `/transaction/:id/categories` | Category selection UI for a transaction |
| `GET` | `/transaction/:id/category/:categoryId` | Assign a category to a transaction |
| `GET` | `/transaction/:id/newCategory?name=X` | Create and assign a new category |
| `GET` | `/transaction/:id/budget/:budgetId` | Assign a budget to a transaction |
| `GET` | `/hide-toggle/category/:name` | Toggle visibility of a category |
| `GET` | `/hide-toggle/budget/:name` | Toggle visibility of a budget |
| `POST` | `/webhook` | Firefly III webhook receiver (HMAC SHA3-256 verified) |

## Webhook setup

Configure a webhook in Firefly III pointing to `https://<SERVICE_URL>/webhook` with the secret matching `FIREFLY_III_WEBHOOK_SECRET`.

Supported triggers:

- Transaction create / update / delete
- Budget create / update / delete
- Budget limit store / update

When a webhook is received, Sparkleft enqueues the relevant jobs (uncategorised check, unbudgeted check, budget limit update, message cleanup, etc.).

## Development

### Available scripts

```bash
yarn dev:server          # Server with hot-reload + pretty logs
yarn dev:worker          # Worker with hot-reload + pretty logs
yarn build               # Compile TypeScript → build/
yarn lint                # ESLint
yarn format              # Prettier (write)
yarn format-check        # Prettier (check)
yarn type-check          # TypeScript type checking
yarn test                # Run tests
yarn test:coverage       # Run tests with coverage report
yarn docker:build        # Build the Docker image locally
yarn types:api:generate  # Regenerate Firefly III API types
yarn release             # Semantic release
yarn clean               # Remove build/ and node_modules/
```

### Project structure

```
src/
├── server.ts              # Express server entry point
├── worker.ts              # BullMQ worker entry point
├── config.ts              # Environment variable configuration
├── client.ts              # Firefly III SDK clients
├── redis.ts               # Redis connection
├── endpoints/             # HTTP route handlers
├── queues/
│   ├── jobs/              # Job implementations (11 job types)
│   ├── queue.ts           # Queue initialisation
│   ├── index.ts           # Worker initialisation
│   ├── queueArgs.ts       # Job argument types
│   └── utils.ts           # Queue utilities
├── modules/notifiers/     # Notification adapters (Discord, Gotify)
├── utils/                 # Shared utilities
└── __tests__/             # Test files
templates/                 # Pug (UI) & Nunjucks (notifications) templates
public/                    # Static assets (CSS, favicon)
```

### Testing

Tests are run with [Vitest](https://vitest.dev/):

```bash
yarn test                # Run all tests
yarn test:coverage       # Generate coverage report (text + HTML)
```

Coverage reports are published to [GitHub Pages](https://billos.github.io/Sparkleft/).

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Pull requests & non-main branches | Lint, format check, build, test |
| `codeql.yml` | Push & schedule | CodeQL security analysis |
| `coverage-pages.yml` | Push to main | Deploy coverage report to GitHub Pages |
| `release.yml` | Push to main | Semantic release, Docker image build & push to Docker Hub |

## License

This project is licensed under the [GPL-3.0](LICENSE) license.
