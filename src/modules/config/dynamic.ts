import Redis from "ioredis"

import { redis } from "../../redis"

export enum VConfig {
  RoleBudgetBillsId = "role-budget-bills-id",
  RoleBudgetLeftoversId = "role-budget-leftovers-id",
  AutoImportCron = "auto-import-cron",
  BudgetSumUpCron = "budget-sum-up-cron",
}

export enum AConfig {
  HiddenCategories = "hidden-categories",
  HiddenBudgets = "hidden-budgets",
}

class DynamicConfig {
  private client: Redis
  private readonly namespace = "sparkleft:config"

  constructor(client: Redis) {
    this.client = client
  }

  private buildKey(key: VConfig | AConfig): string {
    return `${this.namespace}:${key}`
  }

  async get(key: VConfig): Promise<string | null> {
    return this.client.get(this.buildKey(key))
  }

  async set(key: VConfig, value: string): Promise<void> {
    if (!value) {
      await this.client.del(this.buildKey(key))
      return
    }
    await this.client.set(this.buildKey(key), value)
  }

  async delete(key: VConfig): Promise<void> {
    await this.client.del(this.buildKey(key))
  }

  async has(key: VConfig): Promise<boolean> {
    return (await this.client.exists(this.buildKey(key))) === 1
  }

  async lrem(key: AConfig, count: number, value: string): Promise<number> {
    return this.client.lrem(this.buildKey(key), count, value)
  }

  async lrange(key: AConfig, start: number, stop: number): Promise<string[]> {
    return this.client.lrange(this.buildKey(key), start, stop)
  }

  async rpush(key: AConfig, value: string): Promise<number> {
    return this.client.rpush(this.buildKey(key), value)
  }
}

const instance = new DynamicConfig(redis)
export default instance
