import { afterEach, describe, expect, it, vi } from "vitest"

const initializeJobs = vi.fn().mockResolvedValue(undefined)

// Record routes/middleware registered on the express app
const routes: { method: string; path: string; handlers: number }[] = []
const listen = vi.fn((_port: number, cb?: () => void) => {
  cb?.()
  return {}
})
const use = vi.fn()
const set = vi.fn()
const get = vi.fn((path: string, ...handlers: unknown[]) => routes.push({ method: "get", path, handlers: handlers.length }))
const post = vi.fn((path: string, ...handlers: unknown[]) => routes.push({ method: "post", path, handlers: handlers.length }))

const appMock = { use, set, get, post, listen }
const expressMock = Object.assign(
  vi.fn(() => appMock),
  { static: vi.fn(() => "static-middleware") },
)

vi.mock("express", () => ({ default: expressMock }))
vi.mock("../queues", () => ({ initializeJobs }))

describe("server", () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    routes.length = 0
  })

  it("starts the express server and initializes jobs", async () => {
    await import("../server")
    await new Promise<void>((resolve) => setImmediate(resolve))
    expect(expressMock).toHaveBeenCalled()
    expect(listen).toHaveBeenCalledOnce()
    expect(initializeJobs).toHaveBeenCalledOnce()
  })

  it("registers the expected endpoints", async () => {
    await import("../server")
    await new Promise<void>((resolve) => setImmediate(resolve))
    const paths = routes.map((r) => `${r.method} ${r.path}`)
    expect(paths).toContain("post /webhook")
  })
})
