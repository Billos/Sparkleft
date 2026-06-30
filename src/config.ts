const env = {
  get port() {
    return process.env.PORT || 3000
  },
  get fireflyUrl() {
    return process.env.FIREFLY_III_URL
  },
  get fireflyToken() {
    return process.env.FIREFLY_III_TOKEN
  },
  get fireflyCliToken() {
    return process.env.FIREFLY_III_CLI_TOKEN
  },
  get fireflyPaypalAccountToken() {
    return process.env.FIREFLY_III_PAYPAL_ACCOUNT_TOKEN
  },
  get fireflyWebhookSecret() {
    return process.env.FIREFLY_III_WEBHOOK_SECRET
  },
  get apiToken() {
    return process.env.API_TOKEN
  },
  get useApiToken() {
    return process.env.USE_API_TOKEN !== "false"
  },
  get assetAccountId() {
    return process.env.ASSET_ACCOUNT_ID || ""
  },
  get discordWebhook() {
    return process.env.DISCORD_WEBHOOK
  },
  get gotifyUrl() {
    return process.env.GOTIFY_URL
  },
  get gotifyApplicationId() {
    return process.env.GOTIFY_APPLICATION_ID
  },
  get gotifyUserToken() {
    return process.env.GOTIFY_USER_TOKEN
  },
  get gotifyToken() {
    return process.env.GOTIFY_TOKEN || ""
  },
  get serviceUrl() {
    return process.env.SERVICE_URL
  },
  get importerUrl() {
    return process.env.IMPORTER_URL
  },
  get importDirectory() {
    return process.env.IMPORT_DIRECTORY
  },
  get autoImportSecret() {
    return process.env.AUTO_IMPORT_SECRET
  },
  get redisUrl() {
    return process.env.REDIS_URL as string
  },
  get timezone() {
    return process.env.TZ || "Europe/Paris"
  },
}

if (!env.redisUrl) {
  throw new Error("REDIS_URL is not defined in the environment variables")
}

export { env }
