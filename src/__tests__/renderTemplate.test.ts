import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("renderTemplate auto-import.njk", () => {
  beforeEach(() => {
    vi.stubEnv("FIREFLY_III_URL", "http://firefly:8080")
    vi.stubEnv("SERVICE_URL", "http://sparkleft:3000")
    vi.stubEnv("API_TOKEN", "myapitoken")
  })

  afterEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it("includes a link to the auto import UI URL", async () => {
    const { renderTemplate } = await import("../utils/renderTemplate.js")
    const result = renderTemplate("auto-import.njk", { importDirectory: "/imports" })

    expect(result).toContain("http://sparkleft:3000/autoimport?api_token=myapitoken")
  })

})
