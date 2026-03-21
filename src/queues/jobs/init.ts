import pino from "pino"

import { budgetJobs, simpleJobs, transactionJobs } from ".."
import { BudgetJob } from "./BaseJob"

const logger = pino()

export class InitJob extends BudgetJob {
  readonly id = "init"

  async run(_budgetId: string): Promise<void> {
    logger.info("Initializing job definitions")
    for (const instance of [...simpleJobs, ...budgetJobs, ...transactionJobs]) {
      await instance.init()
    }
  }
}
