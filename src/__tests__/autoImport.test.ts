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
    notify: vi.fn().mockResolvedValue(undefined),
  },
}))
vi.mock("../utils/renderTemplate", () => ({
  renderTemplate: vi.fn().mockReturnValue("mock message"),
}))
vi.mock("../queues/queue", () => ({
  getQueue: vi.fn(),
}))

describe("AutoImportJob", () => {
  beforeEach(() => {
    // vi.mocked(fetch).mockResolvedValue({
    //   ok: true,
    //   status: 200,
    //   json: async () => ({}),
    // } as Response)
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
})
