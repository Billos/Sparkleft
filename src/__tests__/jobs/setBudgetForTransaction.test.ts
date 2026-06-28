import { TransactionsService } from "@billos/firefly-iii-sdk"
import { afterEach, describe, expect, it, vi } from "vitest"

import { SetBudgetForTransactionJob } from "../../queues/jobs/setBudgetForTransaction"

vi.mock("@billos/firefly-iii-sdk", () => ({
  TransactionsService: {
    updateTransaction: vi.fn().mockResolvedValue({}),
  },
}))
vi.mock("../../client", () => ({
  client: {},
}))
vi.mock("../../modules/notifiers", () => ({
  notifier: {
    getMessageId: vi.fn().mockResolvedValue("message-id-123"),
    deleteMessage: vi.fn().mockResolvedValue(undefined),
  },
}))
vi.mock("../../utils/notification", () => ({
  unbindTransactionToNotification: vi.fn().mockResolvedValue(undefined),
}))
describe("SetBudgetForTransactionJob", () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })
  it("updates the transaction with the provided budget_id", async () => {
    const job = new SetBudgetForTransactionJob()
    await job.run("42", { budget_id: "7" })
    expect(TransactionsService.updateTransaction).toHaveBeenCalledOnce()
    expect(TransactionsService.updateTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        path: { id: "42" },
        body: {
          apply_rules: true,
          fire_webhooks: true,
          transactions: [{ budget_id: "7" }],
        },
      }),
    )
  })
  it("deletes the existing budget notifier message before updating", async () => {
    const { notifier } = await import("../../modules/notifiers")
    const { unbindTransactionToNotification } = await import("../../utils/notification")
    const job = new SetBudgetForTransactionJob()
    await job.run("42", { budget_id: "7" })
    expect(notifier.getMessageId).toHaveBeenCalledWith("BudgetMessageId", "42")
    expect(unbindTransactionToNotification).toHaveBeenCalledWith("42", "BudgetMessageId", "message-id-123")
    expect(notifier.deleteMessage).toHaveBeenCalledWith("message-id-123")
    expect(TransactionsService.updateTransaction).toHaveBeenCalledOnce()
  })
  it("still updates the transaction when there is no notifier message to delete", async () => {
    const { notifier } = await import("../../modules/notifiers")
    vi.mocked(notifier.getMessageId).mockRejectedValueOnce(new Error("not found"))
    const job = new SetBudgetForTransactionJob()
    await job.run("42", { budget_id: "7" })
    expect(notifier.deleteMessage).not.toHaveBeenCalled()
    expect(TransactionsService.updateTransaction).toHaveBeenCalledOnce()
  })
})
