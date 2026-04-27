import { beforeEach, describe, expect, it, vi } from "vitest"

import { getQueue } from "../queues/queue"
import { SimpleJob } from "../queues/jobs/BaseJob"
import { addJobToQueue } from "../queues/utils"

vi.mock("../queues/queue", () => ({
  getQueue: vi.fn(),
}))

class NonUniqueJob extends SimpleJob {
  readonly id = "non-unique-job"
  async run(): Promise<void> {}
}

class UniqueJob extends SimpleJob {
  readonly id = "unique-job"
  override readonly unique = true
  async run(): Promise<void> {}
}

describe("addJobToQueue - non-unique job", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("adds the job without checking for existing jobs", async () => {
    const add = vi.fn().mockResolvedValue({ id: "new-job-id" })
    const getJobs = vi.fn()
    vi.mocked(getQueue).mockResolvedValue({ add, getJobs } as never)

    const job = new NonUniqueJob()
    await addJobToQueue(job)

    expect(getJobs).not.toHaveBeenCalled()
    expect(add).toHaveBeenCalledOnce()
  })
})

describe("addJobToQueue - unique job", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("removes existing waiting/delayed jobs with the same name before adding", async () => {
    const remove = vi.fn().mockResolvedValue(undefined)
    const existingJob = { id: "existing-id", data: { job: "unique-job" }, remove }
    const otherJob = { id: "other-id", data: { job: "other-job" }, remove }
    const getJobs = vi.fn().mockResolvedValue([existingJob, otherJob])
    const add = vi.fn().mockResolvedValue({ id: "new-job-id" })
    vi.mocked(getQueue).mockResolvedValue({ add, getJobs } as never)

    const job = new UniqueJob()
    await addJobToQueue(job)

    expect(getJobs).toHaveBeenCalledWith(["waiting", "delayed", "prioritized"])
    expect(remove).toHaveBeenCalledOnce() // only the matching job
    expect(add).toHaveBeenCalledOnce()
  })

  it("adds a new job even when no existing job is found", async () => {
    const getJobs = vi.fn().mockResolvedValue([])
    const add = vi.fn().mockResolvedValue({ id: "new-job-id" })
    vi.mocked(getQueue).mockResolvedValue({ add, getJobs } as never)

    const job = new UniqueJob()
    await addJobToQueue(job)

    expect(getJobs).toHaveBeenCalledWith(["waiting", "delayed", "prioritized"])
    expect(add).toHaveBeenCalledOnce()
  })
})
