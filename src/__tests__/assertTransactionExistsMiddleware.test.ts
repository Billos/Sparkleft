import { TransactionsService } from "@billos/firefly-iii-sdk"
import { NextFunction, Request, Response } from "express"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AssertTransactionExistsMiddleware } from "../middleware/assertTransactionExistsMiddleware"

vi.mock("@billos/firefly-iii-sdk", () => ({
  TransactionsService: {
    getTransaction: vi.fn(),
  },
}))
vi.mock("../client", () => ({
  client: {},
}))

describe("AssertTransactionExistsMiddleware", () => {
  let mockReq: Partial<Request<{ transactionId: string }>>
  let mockRes: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockReq = { params: { transactionId: "42" } }
    mockRes = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    }
    mockNext = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("calls next() when the transaction exists", async () => {
    vi.mocked(TransactionsService.getTransaction).mockResolvedValue({} as never)
    await AssertTransactionExistsMiddleware(mockReq as Request<{ transactionId: string }>, mockRes as Response, mockNext)
    expect(TransactionsService.getTransaction).toHaveBeenCalledWith(expect.objectContaining({ path: { id: "42" } }))
    expect(mockNext).toHaveBeenCalledOnce()
    expect(mockRes.status).not.toHaveBeenCalled()
  })

  it("returns 404 when the transaction does not exist", async () => {
    vi.mocked(TransactionsService.getTransaction).mockRejectedValue(new Error("not found"))
    await AssertTransactionExistsMiddleware(mockReq as Request<{ transactionId: string }>, mockRes as Response, mockNext)
    expect(mockRes.status).toHaveBeenCalledWith(404)
    expect(mockRes.send).toHaveBeenCalledWith("Transaction not found")
    expect(mockNext).not.toHaveBeenCalled()
  })
})
