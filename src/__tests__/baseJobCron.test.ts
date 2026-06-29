import { beforeEach, describe, expect, it, vi } from "vitest"

import DynamicConfig, { VConfig } from "../modules/config/dynamic"
import { getQueue } from "../queues/queue"

vi.mock("../queues/queue", () => ({
  getQueue: vi.fn(),
}))

vi.mock("../modules/config/dynamic", async () => {
  const actual = await vi.importActual<typeof import("../modules/config/dynamic")>("../modules/config/dynamic")
  return {
    ...actual,
    default: { get: vi.fn() },
  }
})

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
      "cron-job-repeat-repeat",
      { pattern: "0 * * * *" },
      { name: "cron-job-repeat", data: { job: "cron-job-repeat" } },
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

  it("schedules using the cron pattern stored in DynamicConfig", async () => {
    const upsertJobScheduler = vi.fn().mockResolvedValue(undefined)
    vi.mocked(getQueue).mockResolvedValue({ upsertJobScheduler } as never)
    vi.mocked(DynamicConfig.get).mockResolvedValue("30 7 * * *")

    const { SimpleJob } = await import("../queues/jobs/BaseJob.js")
    class ConfigCronJob extends SimpleJob {
      readonly id = "config-cron-job"
      override readonly cronConfigKey = VConfig.AutoImportCron
      async run(): Promise<void> {}
    }

    await new ConfigCronJob().init()

    expect(DynamicConfig.get).toHaveBeenCalledWith(VConfig.AutoImportCron)
    expect(upsertJobScheduler).toHaveBeenCalledOnce()
    expect(upsertJobScheduler).toHaveBeenCalledWith(
      "config-cron-job-repeat-repeat",
      { pattern: "30 7 * * *" },
      { name: "config-cron-job-repeat", data: { job: "config-cron-job-repeat" } },
    )
  })

  it("does not schedule when DynamicConfig has no cron pattern", async () => {
    const upsertJobScheduler = vi.fn().mockResolvedValue(undefined)
    vi.mocked(getQueue).mockResolvedValue({ upsertJobScheduler } as never)
    vi.mocked(DynamicConfig.get).mockResolvedValue(null)

    const { SimpleJob } = await import("../queues/jobs/BaseJob.js")
    class ConfigCronJob extends SimpleJob {
      readonly id = "config-cron-job-empty"
      override readonly cronConfigKey = VConfig.BudgetSumUpCron
      async run(): Promise<void> {}
    }

    await new ConfigCronJob().init()

    expect(upsertJobScheduler).not.toHaveBeenCalled()
  })
})
