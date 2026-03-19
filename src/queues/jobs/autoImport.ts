import axios from "axios"
import pino from "pino"

import { env } from "../../config"
import { notifier } from "../../modules/notifiers"
import { renderTemplate } from "../../utils/renderTemplate"
import { JobIds } from "../constants"
import { SimpleJob } from "./BaseJob"

const logger = pino()

class AutoImportJob extends SimpleJob {
  readonly id = JobIds.AUTO_IMPORT

  override readonly retryable = false

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

export const autoImport = new AutoImportJob()
