import { EventEmitter } from "events"

import { NextFunction, Request, Response } from "express"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ParseBodyMiddleware } from "../middleware/parseBodyMiddleware"

type FakeRequest = EventEmitter & { rawBody?: string; body?: unknown }

function emitData(req: EventEmitter, payload: string) {
  // Emit on next tick so the middleware can register its listeners first
  setImmediate(() => {
    req.emit("data", Buffer.from(payload, "utf8"))
    req.emit("end")
  })
}

describe("ParseBodyMiddleware", () => {
  let mockReq: FakeRequest
  let mockRes: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockReq = new EventEmitter() as FakeRequest
    mockRes = {}
    mockNext = vi.fn()
  })

  it("parses the raw body into JSON and stores rawBody", async () => {
    const payload = JSON.stringify({ event: "transaction.created" })
    emitData(mockReq, payload)
    ParseBodyMiddleware(mockReq as unknown as Request, mockRes as Response, mockNext)
    await new Promise<void>((resolve) => setImmediate(resolve))
    expect(mockReq.rawBody).toBe(payload)
    expect(mockReq.body).toEqual({ event: "transaction.created" })
    expect(mockNext).toHaveBeenCalledOnce()
  })

  it("defaults to an empty object when the body is empty", async () => {
    emitData(mockReq, "")
    ParseBodyMiddleware(mockReq as unknown as Request, mockRes as Response, mockNext)
    await new Promise<void>((resolve) => setImmediate(resolve))
    expect(mockReq.rawBody).toBe("")
    expect(mockReq.body).toEqual({})
    expect(mockNext).toHaveBeenCalledOnce()
  })
})
