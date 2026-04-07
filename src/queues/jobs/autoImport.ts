import { AboutService } from "@billos/firefly-iii-sdk"
import pino from "pino"

import { client } from "../../client"
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

    if (env.fireflyCliToken) {
      logger.info("Triggering Firefly III cron job before auto-import")
      // await AboutService.getCron(env.fireflyCliToken)
      await AboutService.getCron({ client, path: { cliToken: env.fireflyCliToken } })
      logger.info("Firefly III cron job triggered successfully")
    } else {
      logger.warn("FIREFLY_III_CLI_TOKEN is not set, skipping Firefly III cron job trigger")
    }

    const params = new URLSearchParams()
    params.set("directory", env.importDirectory)
    params.set("secret", env.autoImportSecret)

    const url = `${env.importerUrl}/autoimport?${params.toString()}`
    logger.info("Triggering auto-import at %s/autoimport with directory: %s", env.importerUrl, env.importDirectory)
    const result = await fetch(url, { method: "POST" })
    if (!result.ok) {
      throw new Error(`Auto-import request failed with status ${result.status}: ${await result.text()}`)
    }
    logger.info("Auto-import triggered successfully")

    const queue = await getQueue()
    const scheduler = await queue.getJobScheduler("auto-import-repeat")
    const previousNotificationId = scheduler?.template?.data?.notificationId as string | undefined

    const msg = renderTemplate("auto-import.njk", { importDirectory: env.importDirectory })
    const notificationId = await notifier.notify("Auto Import", msg)

    if (previousNotificationId) {
      logger.info("Deleting previous auto-import notification with ID %s", previousNotificationId)
      try {
        await notifier.deleteMessageImpl(previousNotificationId, null)
      } catch (err) {
        logger.warn({ err }, "Failed to delete previous auto-import notification %s", previousNotificationId)
      }
    }

    if (notificationId && env.autoImportCron) {
      logger.info("Storing new auto-import notification ID %s in scheduler data", notificationId)
      try {
        await queue.upsertJobScheduler("auto-import-repeat", { pattern: env.autoImportCron }, { name: this.id, data: { job: this.id, notificationId } })
      } catch (err) {
        logger.warn({ err }, "Failed to store auto-import notification ID %s in scheduler data", notificationId)
      }
    }
  }
}
