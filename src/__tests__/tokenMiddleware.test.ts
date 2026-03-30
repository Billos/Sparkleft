import { NextFunction, Request, Response } from "express"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// We need to reset modules between tests to reload config with different env vars
describe("TokenMiddleware", () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockReq = { query: {} }
    mockRes = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockResolvedValue(undefined),
    }
    mockNext = vi.fn()
  })

  afterEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it("calls next() when the correct token is provided and USE_API_TOKEN is not set", async () => {
    vi.stubEnv("API_TOKEN", "secret123")
    vi.stubEnv("USE_API_TOKEN", "")
    const { TokenMiddleware } = await import("../utils/tokenMiddleware.js")
    mockReq.query = { api_token: "secret123" }
    await TokenMiddleware(mockReq as Request, mockRes as Response, mockNext)
    expect(mockNext).toHaveBeenCalledOnce()
    expect(mockRes.status).not.toHaveBeenCalled()
  })

  it("returns 401 when the token is wrong and USE_API_TOKEN is not set", async () => {
    vi.stubEnv("API_TOKEN", "secret123")
    vi.stubEnv("USE_API_TOKEN", "")
    const { TokenMiddleware } = await import("../utils/tokenMiddleware.js")
    mockReq.query = { api_token: "wrongtoken" }
    await TokenMiddleware(mockReq as Request, mockRes as Response, mockNext)
    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(401)
  })

  it("returns 401 when the token is missing and USE_API_TOKEN is not set", async () => {
    vi.stubEnv("API_TOKEN", "secret123")
    vi.stubEnv("USE_API_TOKEN", "")
    const { TokenMiddleware } = await import("../utils/tokenMiddleware.js")
    mockReq.query = {}
    await TokenMiddleware(mockReq as Request, mockRes as Response, mockNext)
    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(401)
  })

  it("calls next() without token check when USE_API_TOKEN=false", async () => {
    vi.stubEnv("API_TOKEN", "secret123")
    vi.stubEnv("USE_API_TOKEN", "false")
    const { TokenMiddleware } = await import("../utils/tokenMiddleware.js")
    mockReq.query = {}
    await TokenMiddleware(mockReq as Request, mockRes as Response, mockNext)
    expect(mockNext).toHaveBeenCalledOnce()
    expect(mockRes.status).not.toHaveBeenCalled()
  })

  it("enforces token check when USE_API_TOKEN=true", async () => {
    vi.stubEnv("API_TOKEN", "secret123")
    vi.stubEnv("USE_API_TOKEN", "true")
    const { TokenMiddleware } = await import("../utils/tokenMiddleware.js")
    mockReq.query = {}
    await TokenMiddleware(mockReq as Request, mockRes as Response, mockNext)
    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(401)
  })
})
