import pino from "pino"

import { BudgetJob } from "./BaseJob"

const logger = pino()

export class InitJob extends BudgetJob {
  readonly id = "init"

  async run(_budgetId: string): Promise<void> {
    logger.info("Initializing job definitions")
    const { budgetJobs, simpleJobs, transactionJobs } = await import("../index.js")
    for (const instance of [...simpleJobs, ...budgetJobs, ...transactionJobs]) {
      await instance.init()
    }
  }
}
