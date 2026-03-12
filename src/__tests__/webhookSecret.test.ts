import crypto from "crypto"

import { describe, expect, it } from "vitest"

import { verifyWebhookSignature } from "../utils/webhookSecret"

function buildSignatureHeader(rawBody: string, secret: string, timestamp = "1234567890"): string {
  const signedPayload = `${timestamp}.${rawBody}`
  const signature = crypto.createHmac("sha3-256", secret).update(signedPayload, "utf8").digest("hex")
  return `t=${timestamp},v1=${signature}`
}

describe("verifyWebhookSignature", () => {
  const secret = "test-secret"
  const body = JSON.stringify({ event: "transaction.created" })

  it("returns true for a valid signature", () => {
    const header = buildSignatureHeader(body, secret)
    expect(verifyWebhookSignature(header, body, secret)).toBe(true)
  })

  it("returns false when the signature is wrong", () => {
    const header = buildSignatureHeader(body, "wrong-secret")
    expect(verifyWebhookSignature(header, body, secret)).toBe(false)
  })

  it("returns false when the body has been tampered with", () => {
    const header = buildSignatureHeader(body, secret)
    const tamperedBody = JSON.stringify({ event: "tampered" })
    expect(verifyWebhookSignature(header, tamperedBody, secret)).toBe(false)
  })

  it("returns false when the signature header is missing parts", () => {
    expect(verifyWebhookSignature("t=1234567890", body, secret)).toBe(false)
    expect(verifyWebhookSignature("v1=abc123", body, secret)).toBe(false)
    expect(verifyWebhookSignature("", body, secret)).toBe(false)
  })

  it("returns false when the received signature has a different length", () => {
    const header = "t=1234567890,v1=tooshort"
    expect(verifyWebhookSignature(header, body, secret)).toBe(false)
  })
})
