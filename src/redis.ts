import Redis from "ioredis"

import { env } from "./config"

const redis = new Redis(env.redisConnection)

export { redis }
