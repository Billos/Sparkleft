import axios from "axios"
import pino from "pino"

import { env } from "../../config"
import { JobIds } from "../constants"

const id = JobIds.AUTO_IMPORT

const logger = pino()

async function job() {
  if (!env.importerUrl) {
    logger.info("No importer URL configured, skipping auto-import job")
    return
  }

  const params = new URLSearchParams()
  if (env.importDirectory) {
    params.set("directory", env.importDirectory)
  }
  if (env.autoImportSecret) {
    params.set("secret", env.autoImportSecret)
  }

  const url = `${env.importerUrl}/autoimport?${params.toString()}`
  logger.info("Triggering auto-import at %s/autoimport with directory: %s", env.importerUrl, env.importDirectory ?? "(none)")
  await axios.post(url)
  logger.info("Auto-import triggered successfully")
}

async function init() {}

export { job, init, id }
