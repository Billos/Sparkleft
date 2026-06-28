import Redis from "ioredis"

import { env } from "./config"

export const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
})
