import { beforeEach, describe, expect, it, vi } from "vitest"

import { getQueue } from "../queues/queue"

vi.mock("../queues/queue", () => ({
  getQueue: vi.fn(),
}))

describe("BaseJob - cron scheduler", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("sets up a scheduler when cronPattern is configured", async () => {
    const upsertJobScheduler = vi.fn().mockResolvedValue(undefined)
    vi.mocked(getQueue).mockResolvedValue({ upsertJobScheduler } as never)

    const { SimpleJob } = await import("../queues/jobs/BaseJob.js")
    class CronJob extends SimpleJob {
      readonly id = "cron-job"
      override readonly cronPattern = "0 * * * *"
      async run(): Promise<void> {}
    }

    await new CronJob().init()

    expect(upsertJobScheduler).toHaveBeenCalledOnce()
    expect(upsertJobScheduler).toHaveBeenCalledWith(
      "cron-job-repeat",
      { pattern: "0 * * * *" },
      { name: "cron-job", data: { job: "cron-job" } },
    )
  })

  it("does not set up a scheduler when cronPattern is missing", async () => {
    const upsertJobScheduler = vi.fn().mockResolvedValue(undefined)
    vi.mocked(getQueue).mockResolvedValue({ upsertJobScheduler } as never)

    const { SimpleJob } = await import("../queues/jobs/BaseJob.js")
    class NoCronJob extends SimpleJob {
      readonly id = "no-cron-job"
      async run(): Promise<void> {}
    }

    await new NoCronJob().init()

    expect(upsertJobScheduler).not.toHaveBeenCalled()
  })

  it("swallows scheduler setup errors", async () => {
    const upsertJobScheduler = vi.fn().mockRejectedValue(new Error("boom"))
    vi.mocked(getQueue).mockResolvedValue({ upsertJobScheduler } as never)

    const { SimpleJob } = await import("../queues/jobs/BaseJob.js")
    class CronJob extends SimpleJob {
      readonly id = "failing-cron-job"
      override readonly cronPattern = "*/5 * * * *"
      async run(): Promise<void> {}
    }

    await expect(new CronJob().init()).resolves.toBeUndefined()
    expect(upsertJobScheduler).toHaveBeenCalledOnce()
  })
})
