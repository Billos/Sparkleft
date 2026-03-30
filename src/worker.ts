import pino from "pino"

import { initializeWorker } from "./queues"

const logger = pino()
async function startWorker() {
  try {
    logger.info("Starting worker...")
    await initializeWorker()
  } catch (err) {
    logger.error({ err }, "Failed to start worker:")
    process.exit(1)
  }
}

startWorker()
