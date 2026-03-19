import { ASAP_JOB_DELAY, JOB_DELAYS, JobIds } from "../constants"

export abstract class BaseJob {
  abstract readonly id: JobIds

  readonly retryable: boolean = true

  getStartDelay(asap: boolean = false): number {
    if (asap) {
      return ASAP_JOB_DELAY
    }
    return JOB_DELAYS[this.id] * 1000
  }

  getRetryDelay(retryCount: number): number {
    return retryCount * 60 * 1000
  }

  async init(): Promise<void> {}
}

export abstract class SimpleJob extends BaseJob {
  abstract run(): Promise<void>
}

export abstract class TransactionJob extends BaseJob {
  abstract run(transactionId: string): Promise<void>
}

export abstract class BudgetJob extends BaseJob {
  abstract run(budgetId: string): Promise<void>
}

export abstract class EndpointJob extends BaseJob {
  abstract run(transactionId: string, data: unknown): Promise<void>
}
