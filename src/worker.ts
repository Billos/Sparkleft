import pino from "pino"

import { initializeWorker } from "./queues"
import { initializeI18N } from "./utils/i18n"

const logger = pino()
async function startWorker() {
  try {
    logger.info("Starting worker...")
    await initializeI18N()
    await initializeWorker()
  } catch (err) {
    logger.error({ err }, "Failed to start worker:")
    process.exit(1)
  }
}

startWorker()
