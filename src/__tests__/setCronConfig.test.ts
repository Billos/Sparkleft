import { Request, Response } from "express"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { setCronConfig } from "../endpoints/setCronConfig"
import DynamicConfig, { VConfig } from "../modules/config/dynamic"

const rescheduleAutoImport = vi.fn().mockResolvedValue(undefined)
const rescheduleBudgetSumUp = vi.fn().mockResolvedValue(undefined)

vi.mock("../modules/config/dynamic", async () => {
  const actual = await vi.importActual<typeof import("../modules/config/dynamic")>("../modules/config/dynamic")
  return {
    ...actual,
    default: { set: vi.fn().mockResolvedValue(undefined) },
  }
})

vi.mock("../queues/jobs/autoImport", () => ({
  AutoImportJob: vi.fn(function () {
    return { rescheduleCronJob: rescheduleAutoImport }
  }),
}))

vi.mock("../queues/jobs/budgetSumUp", () => ({
  BudgetSumUpJob: vi.fn(function () {
    return { rescheduleCronJob: rescheduleBudgetSumUp }
  }),
}))

function buildResponse(): Response {
  const res = {} as Response
  res.status = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  return res
}

describe("setCronConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it("stores the cron value and reschedules the auto-import job", async () => {
    const req = { params: { type: "auto-import" }, body: { cron: "0 7 * * *" } } as unknown as Request<{ type: string }>
    const res = buildResponse()

    await setCronConfig(req, res)

    expect(DynamicConfig.set).toHaveBeenCalledWith(VConfig.AutoImportCron, "0 7 * * *")
    expect(rescheduleAutoImport).toHaveBeenCalledOnce()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.send).toHaveBeenCalledWith({ type: "auto-import", cron: "0 7 * * *" })
  })

  it("stores the cron value and reschedules the budget-sum-up job", async () => {
    const req = { params: { type: "budget-sum-up" }, body: { cron: "0 8 * * *" } } as unknown as Request<{ type: string }>
    const res = buildResponse()

    await setCronConfig(req, res)

    expect(DynamicConfig.set).toHaveBeenCalledWith(VConfig.BudgetSumUpCron, "0 8 * * *")
    expect(rescheduleBudgetSumUp).toHaveBeenCalledOnce()
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it("clears the schedule when given an empty cron value", async () => {
    const req = { params: { type: "auto-import" }, body: { cron: "" } } as unknown as Request<{ type: string }>
    const res = buildResponse()

    await setCronConfig(req, res)

    expect(DynamicConfig.set).toHaveBeenCalledWith(VConfig.AutoImportCron, "")
    expect(rescheduleAutoImport).toHaveBeenCalledOnce()
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it("rejects an unknown cron type", async () => {
    const req = { params: { type: "unknown" }, body: { cron: "0 7 * * *" } } as unknown as Request<{ type: string }>
    const res = buildResponse()

    await setCronConfig(req, res)

    expect(DynamicConfig.set).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it("rejects an invalid cron expression", async () => {
    const req = { params: { type: "auto-import" }, body: { cron: "a b c d e" } } as unknown as Request<{ type: string }>
    const res = buildResponse()

    await setCronConfig(req, res)

    expect(DynamicConfig.set).not.toHaveBeenCalled()
    expect(rescheduleAutoImport).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it("rejects a cron expression with the wrong number of fields", async () => {
    const req = { params: { type: "auto-import" }, body: { cron: "0 7 *" } } as unknown as Request<{ type: string }>
    const res = buildResponse()

    await setCronConfig(req, res)

    expect(DynamicConfig.set).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })
})
