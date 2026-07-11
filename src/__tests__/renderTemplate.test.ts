import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import DynamicConfig, { VConfig } from "../modules/config/dynamic"
import { initializeI18N } from "../utils/i18n.js"
import { renderTemplate, TemplateName } from "../utils/renderTemplate.js"

describe("renderTemplate auto-import.njk", () => {
  beforeAll(async () => {
    await initializeI18N()
  })

  beforeEach(() => {
    vi.stubEnv("FIREFLY_III_URL", "http://firefly:8080")
    vi.stubEnv("SERVICE_URL", "http://sparkleft:3000")
    vi.stubEnv("API_TOKEN", "myapitoken")
  })

  afterEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  vi.mock("../modules/config/dynamic", async () => {
    const actual = await vi.importActual<typeof import("../modules/config/dynamic")>("../modules/config/dynamic")
    return {
      ...actual,
      default: { get: vi.fn() },
    }
  })

  it("includes a link to the control page URL", async () => {
    const result = await renderTemplate(TemplateName.AutoImport, {
      accountBalance: "100.00",
      accountCurrency: "€",
      diffExpenses: 0,
      diffDeposits: 0,
      diffTransfers: 0,
      deposits: [],
      expenses: [],
      transfers: [],
    })

    expect(DynamicConfig.get).toHaveBeenCalledWith(VConfig.Locale)
    expect(result).toContain("http://sparkleft:3000/control?api_token=myapitoken")
  })

  it("lists imported transfers when diffTransfers is positive", async () => {
    const result = await renderTemplate(TemplateName.AutoImport, {
      accountBalance: "100.00",
      accountCurrency: "€",
      diffExpenses: 0,
      diffDeposits: 0,
      diffTransfers: 1,
      deposits: [],
      expenses: [],
      transfers: [
        {
          id: "1",
          attributes: { transactions: [{ amount: "10.00", description: "Savings", currency_symbol: "€", currency_decimal_places: 2 }] },
        },
      ] as never,
    })

    expect(DynamicConfig.get).toHaveBeenCalledWith(VConfig.Locale)
    expect(result).toContain("Imported 1 transfers.")
    expect(result).toContain("Savings")
  })

  it("shows no transfers message when diffTransfers is zero", async () => {
    const result = await renderTemplate(TemplateName.AutoImport, {
      accountBalance: "100.00",
      accountCurrency: "€",
      diffExpenses: 0,
      diffDeposits: 0,
      diffTransfers: 0,
      deposits: [],
      expenses: [],
      transfers: [],
    })

    expect(DynamicConfig.get).toHaveBeenCalledWith(VConfig.Locale)
    expect(result).toContain("No new transfers imported.")
  })
})
