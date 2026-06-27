const env = {
  port: process.env.PORT || 3000,
  fireflyUrl: process.env.FIREFLY_III_URL,
  fireflyToken: process.env.FIREFLY_III_TOKEN,
  fireflyCliToken: process.env.FIREFLY_III_CLI_TOKEN,
  fireflyPaypalAccountToken: process.env.FIREFLY_III_PAYPAL_ACCOUNT_TOKEN,
  fireflyWebhookSecret: process.env.FIREFLY_III_WEBHOOK_SECRET,
  apiToken: process.env.API_TOKEN,
  useApiToken: process.env.USE_API_TOKEN !== "false",
  assetAccountId: process.env.ASSET_ACCOUNT_ID || "",
  discordWebhook: process.env.DISCORD_WEBHOOK,
  gotifyUrl: process.env.GOTIFY_URL,
  gotifyApplicationId: process.env.GOTIFY_APPLICATION_ID,
  gotifyUserToken: process.env.GOTIFY_USER_TOKEN,
  gotifyToken: process.env.GOTIFY_TOKEN || "",
  serviceUrl: process.env.SERVICE_URL,
  importerUrl: process.env.IMPORTER_URL,
  importDirectory: process.env.IMPORT_DIRECTORY,
  autoImportSecret: process.env.AUTO_IMPORT_SECRET,
  autoImportCron: process.env.AUTO_IMPORT_CRON,
  budgetSumUpCron: process.env.BUDGET_SUM_UP_CRON,
  redisUrl: process.env.REDIS_URL || "",
}

if (!env.redisUrl) {
  throw new Error("REDIS_URL is not defined in the environment variables")
}

export { env }
