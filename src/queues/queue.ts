import { Queue } from "bullmq"

import { redis as connection } from "../redis"
import { QueueArgs } from "./queueArgs"

let queue: Queue<QueueArgs> | null = null

export async function getQueue(): Promise<Queue<QueueArgs>> {
  if (queue) {
    return queue
  }

  queue = new Queue("manager", { connection })
  return queue
}
