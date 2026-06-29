import pino from "pino"

import { notifier } from "../../modules/notifiers"
import DynamicConfig, { VConfig } from "../../modules/config/dynamic"
import { redis } from "../../redis"
import { renderTemplate, TemplateContextMap, TemplateName } from "../../utils/renderTemplate"
import { getQueue } from "../queue"

const logger = pino()

export abstract class BaseJob {
  abstract readonly id: string

  readonly retryable: boolean = true

  readonly startDelay: number = 0

  readonly retryDelay: number = 60

  readonly uniqueNotificationKey?: string

  readonly cronPattern?: string

  readonly cronConfigKey?: VConfig

  getStartDelay(asap: boolean = false): number {
    if (asap) {
      return 2000 // 2 seconds
    }
    return this.startDelay * 1000
  }

  getRetryDelay(retryCount: number): number {
    return retryCount * this.retryDelay * 1000
  }

  async resolveCronPattern(): Promise<string | undefined> {
    if (this.cronConfigKey) {
      return (await DynamicConfig.get(this.cronConfigKey)) ?? undefined
    }
    return this.cronPattern
  }

  async init(): Promise<void> {
    const pattern = await this.resolveCronPattern()
    if (pattern) {
      await this.scheduleCronJob(pattern)
    }
  }

  private async scheduleCronJob(pattern: string): Promise<void> {
    const queue = await getQueue()
    const id = `${this.id}-repeat`
    logger.info("Setting up scheduler for %s with cron '%s'", id, pattern)
    try {
      await queue.upsertJobScheduler(`${id}-repeat`, { pattern }, { name: id, data: { job: id } })
    } catch (err) {
      logger.error({ err }, "Failed to set up scheduler for job %s", id)
    }
  }

  async sendUniqueNotification<T extends TemplateName>(title: string, template: T, data: TemplateContextMap[T]): Promise<void> {
    if (!this.uniqueNotificationKey) {
      throw new Error("uniqueNotificationKey is not set for this job")
    }
    const previousNotificationId = await redis.get(this.uniqueNotificationKey)
    if (previousNotificationId) {
      logger.info("Deleting previous notification with ID %s", previousNotificationId)
      try {
        await notifier.deleteMessage(previousNotificationId)
      } catch (err) {
        logger.error({ err }, "Failed to delete previous notification with ID %s", previousNotificationId)
      }
    }

    const msg = renderTemplate(template, data)
    const notificationId = await notifier.sendMessage(title, msg)
    await redis.set(this.uniqueNotificationKey, notificationId)
  }
}

export abstract class SimpleJob extends BaseJob {
  abstract run(): Promise<void>
}

export abstract class TransactionJob extends BaseJob {
  abstract run(transactionId: string): Promise<void>
}

export abstract class BudgetJob extends BaseJob {
  abstract run(budgetId: string): Promise<void>
}

export abstract class EndpointJob extends BaseJob {
  abstract run(transactionId: string, data: unknown): Promise<void>
}
