import axios from "axios"
import pino from "pino"

import { env } from "../../config"
import { notifier } from "../../modules/notifiers"
import { renderTemplate } from "../../utils/renderTemplate"
import { getQueue } from "../queue"
import { SimpleJob } from "./BaseJob"

const logger = pino()

export class AutoImportJob extends SimpleJob {
  readonly id = "auto-import"

  override readonly retryable = false // auto-import is triggered externally and should not be retried on failure

  override async init(): Promise<void> {
    if (!env.autoImportCron) {
      logger.info("AUTO_IMPORT_CRON is not set, skipping auto-import scheduler setup")
      return
    }
    const queue = await getQueue()
    logger.info("Setting up auto-import scheduler with cron '%s'", env.autoImportCron)
    try {
      await queue.upsertJobScheduler("auto-import-repeat", { pattern: env.autoImportCron }, { name: this.id, data: { job: this.id } })
    } catch (err) {
      logger.error({ err }, "Failed to set up auto-import scheduler; auto-import will not run automatically")
    }
  }

  async run(): Promise<void> {
    if (!env.importerUrl || !env.importDirectory || !env.autoImportSecret) {
      logger.warn("Missing required configuration for auto-import job (importerUrl, importDirectory, autoImportSecret), skipping")
      return
    }

    const params = new URLSearchParams()
    params.set("directory", env.importDirectory)
    params.set("secret", env.autoImportSecret)

    const url = `${env.importerUrl}/autoimport?${params.toString()}`
    logger.info("Triggering auto-import at %s/autoimport with directory: %s", env.importerUrl, env.importDirectory)
    await axios.post(url)
    logger.info("Auto-import triggered successfully")
    const msg = renderTemplate("auto-import.njk", { importDirectory: env.importDirectory })
    await notifier.notify("Auto Import", msg)
  }
}
