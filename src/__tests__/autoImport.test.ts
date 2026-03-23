import axios from "axios"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AboutService } from "../types"
import type { CronResult } from "../types/models/CronResult"

vi.mock("axios")
vi.mock("../types", () => ({
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
    vi.mocked(axios.post).mockResolvedValue({})
    vi.mocked(AboutService.getCron).mockResolvedValue({} as CronResult)
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

    const { AutoImportJob } = await import("../queues/jobs/autoImport")
    const job = new AutoImportJob()
    await job.run()

    expect(AboutService.getCron).toHaveBeenCalledOnce()
    expect(AboutService.getCron).toHaveBeenCalledWith("myclitoken")
    expect(axios.post).toHaveBeenCalledOnce()

    // Verify getCron was called before axios.post
    const getCronOrder = vi.mocked(AboutService.getCron).mock.invocationCallOrder[0]
    const axiosPostOrder = vi.mocked(axios.post).mock.invocationCallOrder[0]
    expect(getCronOrder).toBeLessThan(axiosPostOrder)
  })

  it("skips getCron and still calls the importer when cliToken is not set", async () => {
    vi.stubEnv("IMPORTER_URL", "http://importer:8080")
    vi.stubEnv("IMPORT_DIRECTORY", "/imports")
    vi.stubEnv("AUTO_IMPORT_SECRET", "mysecret")
    vi.stubEnv("FIREFLY_III_CLI_TOKEN", "")

    const { AutoImportJob } = await import("../queues/jobs/autoImport")
    const job = new AutoImportJob()
    await job.run()

    expect(AboutService.getCron).not.toHaveBeenCalled()
    expect(axios.post).toHaveBeenCalledOnce()
  })

  it("skips both getCron and the importer when required config is missing", async () => {
    vi.stubEnv("IMPORTER_URL", "")
    vi.stubEnv("IMPORT_DIRECTORY", "")
    vi.stubEnv("AUTO_IMPORT_SECRET", "")
    vi.stubEnv("FIREFLY_III_CLI_TOKEN", "myclitoken")

    const { AutoImportJob } = await import("../queues/jobs/autoImport")
    const job = new AutoImportJob()
    await job.run()

    expect(AboutService.getCron).not.toHaveBeenCalled()
    expect(axios.post).not.toHaveBeenCalled()
  })
})
