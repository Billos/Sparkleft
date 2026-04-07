import { AboutService } from "@billos/firefly-iii-sdk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("fetch")
vi.mock("@billos/firefly-iii-sdk", () => ({
  AboutService: {
    getCron: vi.fn().mockResolvedValue({}),
  },
}))
vi.mock("../modules/notifiers", () => ({
  notifier: {
    notify: vi.fn().mockResolvedValue("new-notif-id"),
    deleteMessageImpl: vi.fn().mockResolvedValue(undefined),
  },
}))
vi.mock("../utils/renderTemplate", () => ({
  renderTemplate: vi.fn().mockReturnValue("mock message"),
}))

const mockGetJobScheduler = vi.fn().mockResolvedValue(undefined)
const mockUpsertJobScheduler = vi.fn().mockResolvedValue(undefined)
vi.mock("../queues/queue", () => ({
  getQueue: vi.fn().mockResolvedValue({
    getJobScheduler: mockGetJobScheduler,
    upsertJobScheduler: mockUpsertJobScheduler,
  }),
}))

describe("AutoImportJob", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => "success" }))
  })

  afterEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it("calls AboutService.getCron before calling the importer when cliToken is set", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")
    vi.stubEnv("FIREFLY_III_CLI_TOKEN", "myclitoken")

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const job = new AutoImportJob()
    await job.run()

    expect(AboutService.getCron).toHaveBeenCalledOnce()
    expect(AboutService.getCron).toHaveBeenCalledWith(
      expect.objectContaining({
        path: { cliToken: "myclitoken" },
      }),
    )
    expect(fetch).toHaveBeenCalledOnce()

    // Verify getCron was called before fetch
    const getCronOrder = vi.mocked(AboutService.getCron).mock.invocationCallOrder[0]
    const fetchPostOrder = vi.mocked(fetch).mock.invocationCallOrder[0]
    expect(getCronOrder).toBeLessThan(fetchPostOrder)
  })

  it("skips getCron and still calls the importer when cliToken is not set", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")
    vi.stubEnv("FIREFLY_III_CLI_TOKEN", "")

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const job = new AutoImportJob()
    await job.run()

    expect(AboutService.getCron).not.toHaveBeenCalled()
    expect(fetch).toHaveBeenCalledOnce()
  })

  it("skips both getCron and the importer when required config is missing", async () => {
    vi.stubEnv("IMPORTER_URL", "")
    vi.stubEnv("IMPORT_DIRECTORY", "")
    vi.stubEnv("AUTO_IMPORT_SECRET", "")
    vi.stubEnv("FIREFLY_III_CLI_TOKEN", "myclitoken")

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const job = new AutoImportJob()
    await job.run()

    expect(AboutService.getCron).not.toHaveBeenCalled()
    expect(fetch).not.toHaveBeenCalled()
  })

  it("stores new notification ID in scheduler data when autoImportCron is set", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")
    vi.stubEnv("AUTO_IMPORT_CRON", "0 * * * *")
    mockGetJobScheduler.mockResolvedValue(undefined)

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const { notifier } = await import("../modules/notifiers/index.js")
    const job = new AutoImportJob()
    await job.run()

    expect(notifier.notify).toHaveBeenCalledOnce()
    expect(mockUpsertJobScheduler).toHaveBeenCalledWith(
      "auto-import-repeat",
      { pattern: "0 * * * *" },
      expect.objectContaining({ data: expect.objectContaining({ notificationId: "new-notif-id" }) }),
    )
  })

  it("deletes previous notification when previous ID is found in scheduler data", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")
    vi.stubEnv("AUTO_IMPORT_CRON", "0 * * * *")
    mockGetJobScheduler.mockResolvedValue({
      template: { data: { job: "auto-import", notificationId: "old-notif-id" } },
    })

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const { notifier } = await import("../modules/notifiers/index.js")
    const job = new AutoImportJob()
    await job.run()

    expect(notifier.deleteMessageImpl).toHaveBeenCalledWith("old-notif-id", null)
  })

  it("does not call deleteMessageImpl when no previous notification ID is in scheduler data", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")
    mockGetJobScheduler.mockResolvedValue({ template: { data: { job: "auto-import" } } })

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const { notifier } = await import("../modules/notifiers/index.js")
    const job = new AutoImportJob()
    await job.run()

    expect(notifier.deleteMessageImpl).not.toHaveBeenCalled()
  })

  it("does not update scheduler when autoImportCron is not set", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")
    vi.stubEnv("AUTO_IMPORT_CRON", "")
    mockGetJobScheduler.mockResolvedValue(undefined)

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const job = new AutoImportJob()
    await job.run()

    expect(mockUpsertJobScheduler).not.toHaveBeenCalled()
  })

  it("continues gracefully if deleting previous notification fails", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")
    vi.stubEnv("AUTO_IMPORT_CRON", "0 * * * *")
    mockGetJobScheduler.mockResolvedValue({
      template: { data: { job: "auto-import", notificationId: "old-notif-id" } },
    })

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const { notifier } = await import("../modules/notifiers/index.js")
    vi.mocked(notifier.deleteMessageImpl).mockRejectedValue(new Error("delete failed"))

    const job = new AutoImportJob()
    await expect(job.run()).resolves.toBeUndefined()
    expect(mockUpsertJobScheduler).toHaveBeenCalled()
  })
})
