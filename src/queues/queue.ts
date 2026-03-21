import { Queue } from "bullmq"

import { env } from "../config"
import { QueueArgs } from "./queueArgs"

let queue: Queue<QueueArgs> | null = null

export async function getQueue(): Promise<Queue<QueueArgs>> {
  if (queue) {
    return queue
  }

  queue = new Queue("manager", { connection: env.redisConnection })
  return queue
}
