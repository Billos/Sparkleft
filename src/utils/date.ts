// import pino from "pino"
import { Temporal } from "@js-temporal/polyfill"

import { env } from "../config"

// const logger = pino()
export function getStartOfCurrentMonth(): string {
  const now = Temporal.Now.zonedDateTimeISO(env.timezone)
  const start = now.with({ day: 1 }).startOfDay()
  return start.toPlainDate().toString()
}

export function getTodayDate(): string {
  const now = Temporal.Now.zonedDateTimeISO(env.timezone)
  const today = now.startOfDay()
  return today.toPlainDate().toString()
}

export function getEndOfCurrentMonth(): string {
  const now = Temporal.Now.zonedDateTimeISO(env.timezone)
  const end = now.with({ day: now.daysInMonth }).with({ hour: 23, minute: 59, second: 59, millisecond: 999 })
  return end.toPlainDate().toString()
}
