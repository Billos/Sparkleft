import { Request, Response } from "express"
import pino from "pino"

import DynamicConfig, { VConfig } from "../modules/config/dynamic"
import { AutoImportJob } from "../queues/jobs/autoImport"
import { BaseJob } from "../queues/jobs/BaseJob"
import { BudgetSumUpJob } from "../queues/jobs/budgetSumUp"

const logger = pino()

enum CronType {
  AutoImport = "auto-import",
  BudgetSumUp = "budget-sum-up",
}

const cronConfig: Record<CronType, { key: VConfig; createJob: () => BaseJob }> = {
  [CronType.AutoImport]: { key: VConfig.AutoImportCron, createJob: () => new AutoImportJob() },
  [CronType.BudgetSumUp]: { key: VConfig.BudgetSumUpCron, createJob: () => new BudgetSumUpJob() },
}

function isCronType(value: string): value is CronType {
  return Object.values(CronType).includes(value as CronType)
}

// Accepts standard 5-field cron expressions as well as the 6-field variant that includes seconds.
function isValidCron(value: string): boolean {
  const fields = value.trim().split(/\s+/)
  return fields.length === 5 || fields.length === 6
}

export async function setCronConfig(req: Request<{ type: string }, unknown, { cron?: string }>, res: Response) {
  const { type } = req.params
  logger.info("=================================== Setting cron config ===================================")

  if (!isCronType(type)) {
    logger.error("Invalid cron type %s", type)
    return res.status(400).send({ message: "Invalid cron type" })
  }

  const { key, createJob } = cronConfig[type]
  const cron = (req.body?.cron ?? "").trim()

  // An empty value clears the schedule.
  if (cron && !isValidCron(cron)) {
    logger.error("Invalid cron expression %s", cron)
    return res.status(400).send({ message: "Invalid cron expression" })
  }

  await DynamicConfig.set(key, cron)
  await createJob().rescheduleCronJob()

  logger.info("Cron config for %s set to '%s'", type, cron)
  return res.status(201).send({ type, cron })
}
