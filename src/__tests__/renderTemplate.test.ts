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

  it("includes a link to the control page URL", async () => {
    const { renderTemplate } = await import("../utils/renderTemplate.js")
    const result = renderTemplate("auto-import.njk", { importDirectory: "/imports" })

    expect(result).toContain("http://sparkleft:3000/control?api_token=myapitoken")
  })

  it("lists imported transfers when diffTransfers is positive", async () => {
    const { renderTemplate } = await import("../utils/renderTemplate.js")
    const result = renderTemplate("auto-import.njk", {
      diffTransfers: 1,
      transfers: [
        {
          id: "1",
          attributes: { transactions: [{ amount: "10.00", description: "Savings", currency_symbol: "€", currency_decimal_places: 2 }] },
        },
      ] as never,
    })

    expect(result).toContain("Imported 1 transfers.")
    expect(result).toContain("Savings")
  })

  it("shows no transfers message when diffTransfers is zero", async () => {
    const { renderTemplate } = await import("../utils/renderTemplate.js")
    const result = renderTemplate("auto-import.njk", { importDirectory: "/imports" })

    expect(result).toContain("No new transfers imported.")
  })
})
