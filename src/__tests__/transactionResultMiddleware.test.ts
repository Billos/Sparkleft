import { Request, Response } from "express"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { TransactionResultMiddleware } from "../middleware/transactionResultMiddleware"

vi.mock("../config", () => ({
  env: { fireflyUrl: "https://firefly.example.com" },
}))

describe("TransactionResultMiddleware", () => {
  let mockReq: Partial<Request<{ transactionId: string }>>
  let mockRes: Partial<Response>

  beforeEach(() => {
    mockReq = { params: { transactionId: "42" } }
    mockRes = { redirect: vi.fn() }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("redirects to the transaction show link", async () => {
    await TransactionResultMiddleware(mockReq as Request<{ transactionId: string }>, mockRes as Response)
    expect(mockRes.redirect).toHaveBeenCalledWith("https://firefly.example.com/transactions/show/42")
  })
})
