import pino from "pino"

import { SimpleJob } from "./BaseJob"

const logger = pino()

export class InitJob extends SimpleJob {
  readonly id = "init"

  async run(): Promise<void> {
    logger.info("Initializing job definitions")
    const { budgetJobs, simpleJobs, transactionJobs } = await import("../index.js")
    for (const instance of [...simpleJobs, ...budgetJobs, ...transactionJobs]) {
      await instance.init()
    }
  }
}
