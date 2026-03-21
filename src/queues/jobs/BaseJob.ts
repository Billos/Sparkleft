import { ASAP_JOB_DELAY } from "../constants"

export abstract class BaseJob {
  abstract readonly id: string

  readonly retryable: boolean = true

  readonly startDelay: number = 0

  readonly retryDelay: number = 60

  getStartDelay(asap: boolean = false): number {
    if (asap) {
      return ASAP_JOB_DELAY
    }
    return this.startDelay * 1000
  }

  getRetryDelay(retryCount: number): number {
    return retryCount * this.retryDelay * 1000
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
