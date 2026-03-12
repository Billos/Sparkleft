import crypto from "crypto"

import { NextFunction, Request, Response } from "express"
import pino from "pino"

import { env } from "../config"

const logger = pino()

export function verifyWebhookSignature(signatureHeader: string, rawBody: string, secret: string): boolean {
  // Parse la signature : t=...,v1=...
  const parts = signatureHeader.split(",")
  const timestampPart = parts.find((p) => p.startsWith("t="))
  const signaturePart = parts.find((p) => p.startsWith("v1="))

  if (!timestampPart || !signaturePart) {
    return false
  }

  const timestamp = timestampPart.slice(2)
  const receivedSignature = signaturePart.slice(3)

  const signedPayload = `${timestamp}.${rawBody}`

  // Calcul du HMAC SHA3-256
  const expectedSignature = crypto.createHmac("sha3-256", secret).update(signedPayload, "utf8").digest("hex")

  // Comparaison en temps constant
  if (expectedSignature.length !== receivedSignature.length) {
    return false
  }

  return crypto.timingSafeEqual(Buffer.from(expectedSignature, "hex"), Buffer.from(receivedSignature, "hex"))
}

export function verifyWebhookMiddleware(req: Request & { rawBody?: string }, res: Response, next: NextFunction) {
  logger.debug("Verifying webhook signature")

  if (!req.headers["signature"]) {
    logger.error("No signature header found")
    res.status(400).send("No signature header found")
    return
  }

  if (!req.rawBody) {
    logger.error("No raw body found on request")
    res.status(400).send("No raw body found")
    return
  }

  if (!env.fireflyWebhookSecret) {
    logger.error("No webhook secret configured")
    res.status(500).send("No webhook secret configured")
    return
  }

  const isValid = verifyWebhookSignature(req.headers["signature"] as string, req.rawBody, env.fireflyWebhookSecret)
  if (isValid) {
    logger.debug("Webhook signature verified")
    return next()
  }
  logger.error("Invalid webhook signature")
  res.status(401).send("Invalid webhook signature")
}
