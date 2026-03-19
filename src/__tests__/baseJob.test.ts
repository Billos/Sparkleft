import { describe, expect, it } from "vitest"

import { ASAP_JOB_DELAY, JobIds } from "../queues/constants"
import { BaseJob, BudgetJob, EndpointJob, SimpleJob, TransactionJob } from "../queues/jobs/BaseJob"
import { AutoImportJob } from "../queues/jobs/autoImport"
import { CheckBudgetLimitJob } from "../queues/jobs/checkBudgetLimit"
import { InitJob } from "../queues/jobs/init"
import { LinkPaypalTransactionsJob } from "../queues/jobs/linkPaypalTransactions"
import { RemoveTransactionMessagesJob } from "../queues/jobs/removeTransactionMessages"
import { SetBudgetForTransactionJob } from "../queues/jobs/setBudgetForTransaction"
import { SetCategoryForTransactionJob } from "../queues/jobs/setCategoryForTransaction"
import { UnbudgetedTransactionsJob } from "../queues/jobs/unbudgetedTransactions"
import { UncategorizedTransactionsJob } from "../queues/jobs/uncategorizedTransactions"
import { UpdateBillsBudgetLimitJob } from "../queues/jobs/updateBillsBudgetLimit"
import { UpdateLeftoverBudgetLimitJob } from "../queues/jobs/updateLeftoverBudgetLimit"

class TestSimpleJob extends SimpleJob {
  readonly id = JobIds.CHECK_BUDGET_LIMIT
  readonly startDelay = 5 // 5 seconds, as owned by this class
  async run(): Promise<void> {}
}

class TestSimpleJobWithCustomRetryDelay extends SimpleJob {
  readonly id = JobIds.UPDATE_BILLS_BUDGET_LIMIT
  readonly startDelay = 15
  override readonly retryDelay = 120 // 2 minutes per retry
  async run(): Promise<void> {}
}

class TestNonRetryableJob extends SimpleJob {
  readonly id = JobIds.AUTO_IMPORT
  override readonly retryable = false
  async run(): Promise<void> {}
}

class TestTransactionJob extends TransactionJob {
  readonly id = JobIds.UNBUDGETED_TRANSACTIONS
  async run(_transactionId: string): Promise<void> {}
}

class TestBudgetJob extends BudgetJob {
  readonly id = JobIds.CHECK_BUDGET_LIMIT
  async run(_budgetId: string): Promise<void> {}
}

class TestEndpointJob extends EndpointJob {
  readonly id = JobIds.SET_CATEGORY_FOR_TRANSACTION
  async run(_transactionId: string, _data: unknown): Promise<void> {}
}

describe("BaseJob", () => {
  const job = new TestSimpleJob()

  it("has retryable = true by default", () => {
    expect(job.retryable).toBe(true)
  })

  it("getStartDelay returns startDelay in milliseconds", () => {
    expect(job.getStartDelay()).toBe(5 * 1000) // startDelay = 5 seconds
  })

  it("getStartDelay returns ASAP_JOB_DELAY when asap = true", () => {
    expect(job.getStartDelay(true)).toBe(ASAP_JOB_DELAY)
  })

  it("retryDelay defaults to 60 seconds", () => {
    expect(job.retryDelay).toBe(60)
  })

  it("getRetryDelay returns retryCount * retryDelay * 1000 ms", () => {
    expect(job.getRetryDelay(1)).toBe(60 * 1000) // 1 minute
    expect(job.getRetryDelay(3)).toBe(3 * 60 * 1000) // 3 minutes
    expect(job.getRetryDelay(5)).toBe(5 * 60 * 1000) // 5 minutes
  })

  it("init() resolves without error by default", async () => {
    await expect(job.init()).resolves.toBeUndefined()
  })

  it("id is set correctly", () => {
    expect(job.id).toBe(JobIds.CHECK_BUDGET_LIMIT)
  })
})

describe("BaseJob - default startDelay", () => {
  it("startDelay defaults to 0 when not overridden", () => {
    const job = new TestNonRetryableJob()
    expect(job.startDelay).toBe(0)
    expect(job.getStartDelay()).toBe(0)
  })
})

describe("BaseJob - non-retryable job", () => {
  const job = new TestNonRetryableJob()

  it("has retryable = false when overridden", () => {
    expect(job.retryable).toBe(false)
  })

  it("still computes start delay correctly", () => {
    expect(job.getStartDelay()).toBe(0) // AUTO_IMPORT has startDelay = 0
  })
})

describe("BaseJob - custom retry delay", () => {
  const job = new TestSimpleJobWithCustomRetryDelay()

  it("uses overridden retryDelay", () => {
    expect(job.retryDelay).toBe(120) // 2 minutes per retry
  })

  it("getRetryDelay uses overridden retryDelay", () => {
    expect(job.getRetryDelay(1)).toBe(2 * 60 * 1000) // 2 minutes
    expect(job.getRetryDelay(3)).toBe(6 * 60 * 1000) // 6 minutes
  })

  it("getStartDelay uses startDelay from the class", () => {
    expect(job.getStartDelay()).toBe(15 * 1000) // startDelay = 15 seconds
  })
})

describe("BaseJob - abstract subclasses can be extended", () => {
  it("SimpleJob can be instantiated with a run() method", () => {
    const j = new TestSimpleJob()
    expect(j).toBeInstanceOf(BaseJob)
    expect(j).toBeInstanceOf(SimpleJob)
  })

  it("TransactionJob can be instantiated with a run(transactionId) method", () => {
    const j = new TestTransactionJob()
    expect(j).toBeInstanceOf(BaseJob)
    expect(j).toBeInstanceOf(TransactionJob)
  })

  it("BudgetJob can be instantiated with a run(budgetId) method", () => {
    const j = new TestBudgetJob()
    expect(j).toBeInstanceOf(BaseJob)
    expect(j).toBeInstanceOf(BudgetJob)
  })

  it("EndpointJob can be instantiated with a run(transactionId, data) method", () => {
    const j = new TestEndpointJob()
    expect(j).toBeInstanceOf(BaseJob)
    expect(j).toBeInstanceOf(EndpointJob)
  })
})

describe("exported job classes can be imported and instantiated", () => {
  it("AutoImportJob is exported and extends SimpleJob", () => {
    const j = new AutoImportJob()
    expect(j).toBeInstanceOf(SimpleJob)
    expect(j.id).toBe(JobIds.AUTO_IMPORT)
    expect(j.retryable).toBe(false)
    expect(j.startDelay).toBe(0)
    expect(j.getStartDelay()).toBe(0)
  })

  it("CheckBudgetLimitJob is exported and extends BudgetJob", () => {
    const j = new CheckBudgetLimitJob()
    expect(j).toBeInstanceOf(BudgetJob)
    expect(j.id).toBe(JobIds.CHECK_BUDGET_LIMIT)
    expect(j.retryable).toBe(true)
    expect(j.startDelay).toBe(5)
    expect(j.getStartDelay()).toBe(5000)
  })

  it("InitJob is exported and extends BudgetJob", () => {
    const j = new InitJob()
    expect(j).toBeInstanceOf(BudgetJob)
    expect(j.id).toBe(JobIds.INIT)
    expect(j.startDelay).toBe(0)
  })

  it("LinkPaypalTransactionsJob is exported and extends SimpleJob", () => {
    const j = new LinkPaypalTransactionsJob()
    expect(j).toBeInstanceOf(SimpleJob)
    expect(j.id).toBe(JobIds.LINK_PAYPAL_TRANSACTIONS)
    expect(j.startDelay).toBe(35)
    expect(j.getStartDelay()).toBe(35000)
  })

  it("RemoveTransactionMessagesJob is exported and extends TransactionJob", () => {
    const j = new RemoveTransactionMessagesJob()
    expect(j).toBeInstanceOf(TransactionJob)
    expect(j.id).toBe(JobIds.REMOVE_TRANSACTION_MESSAGES)
    expect(j.startDelay).toBe(15)
    expect(j.getStartDelay()).toBe(15000)
  })

  it("SetBudgetForTransactionJob is exported and extends EndpointJob", () => {
    const j = new SetBudgetForTransactionJob()
    expect(j).toBeInstanceOf(EndpointJob)
    expect(j.id).toBe(JobIds.SET_BUDGET_FOR_TRANSACTION)
    expect(j.startDelay).toBe(0)
  })

  it("SetCategoryForTransactionJob is exported and extends EndpointJob", () => {
    const j = new SetCategoryForTransactionJob()
    expect(j).toBeInstanceOf(EndpointJob)
    expect(j.id).toBe(JobIds.SET_CATEGORY_FOR_TRANSACTION)
    expect(j.startDelay).toBe(0)
  })

  it("UnbudgetedTransactionsJob is exported and extends TransactionJob", () => {
    const j = new UnbudgetedTransactionsJob()
    expect(j).toBeInstanceOf(TransactionJob)
    expect(j.id).toBe(JobIds.UNBUDGETED_TRANSACTIONS)
    expect(j.startDelay).toBe(5)
    expect(j.getStartDelay()).toBe(5000)
  })

  it("UncategorizedTransactionsJob is exported and extends TransactionJob", () => {
    const j = new UncategorizedTransactionsJob()
    expect(j).toBeInstanceOf(TransactionJob)
    expect(j.id).toBe(JobIds.UNCATEGORIZED_TRANSACTIONS)
    expect(j.startDelay).toBe(10)
    expect(j.getStartDelay()).toBe(10000)
  })

  it("UpdateBillsBudgetLimitJob is exported and extends SimpleJob", () => {
    const j = new UpdateBillsBudgetLimitJob()
    expect(j).toBeInstanceOf(SimpleJob)
    expect(j.id).toBe(JobIds.UPDATE_BILLS_BUDGET_LIMIT)
    expect(j.startDelay).toBe(15)
    expect(j.getStartDelay()).toBe(15000)
  })

  it("UpdateLeftoverBudgetLimitJob is exported and extends SimpleJob", () => {
    const j = new UpdateLeftoverBudgetLimitJob()
    expect(j).toBeInstanceOf(SimpleJob)
    expect(j.id).toBe(JobIds.UPDATE_LEFTOVERS_BUDGET_LIMIT)
    expect(j.startDelay).toBe(25)
    expect(j.getStartDelay()).toBe(25000)
  })
})
