import Redis from "ioredis"

import { env } from "./config"

export const hiddenCategoriesKey = "sparkleft:hidden:categories"

export const hiddenBudgetsKey = "sparkleft:hidden:budgets"

export const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
})
