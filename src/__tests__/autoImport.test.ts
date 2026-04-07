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
    sendMessage: vi.fn().mockResolvedValue("notification-id-123"),
    deleteMessage: vi.fn().mockResolvedValue(undefined),
  },
}))
vi.mock("../utils/renderTemplate", () => ({
  renderTemplate: vi.fn().mockReturnValue("mock message"),
}))
vi.mock("../queues/queue", () => ({
  getQueue: vi.fn(),
}))
vi.mock("../redis", () => ({
  redis: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue("OK"),
  },
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

  it("stores the new notification ID in Redis after sending notification", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const { notifier } = await import("../modules/notifiers")
    const { redis } = await import("../redis")
    const job = new AutoImportJob()
    await job.run()

    expect(notifier.sendMessage).toHaveBeenCalledWith("AutoImportMessage", "mock message", "")
    expect(redis.set).toHaveBeenCalledWith("sparkleft:notification:autoimport:id", "notification-id-123")
  })

  it("deletes the previous notification when a stored ID exists in Redis", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const { notifier } = await import("../modules/notifiers")
    const { redis } = await import("../redis")
    vi.mocked(redis.get).mockResolvedValue("old-notification-id")
    const job = new AutoImportJob()
    await job.run()

    expect(notifier.deleteMessage).toHaveBeenCalledWith("AutoImportMessage", "old-notification-id", "")
    expect(redis.set).toHaveBeenCalledWith("sparkleft:notification:autoimport:id", "notification-id-123")
  })

  it("still sends notification even if deleting the previous one fails", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")

    const { AutoImportJob } = await import("../queues/jobs/autoImport.js")
    const { notifier } = await import("../modules/notifiers")
    const { redis } = await import("../redis")
    vi.mocked(redis.get).mockResolvedValue("old-notification-id")
    vi.mocked(notifier.deleteMessage).mockRejectedValue(new Error("delete failed"))
    const job = new AutoImportJob()
    await job.run()

    expect(notifier.sendMessage).toHaveBeenCalledWith("AutoImportMessage", "mock message", "")
    expect(redis.set).toHaveBeenCalledWith("sparkleft:notification:autoimport:id", "notification-id-123")
  })
})
