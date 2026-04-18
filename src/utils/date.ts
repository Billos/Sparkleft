import { DateTime } from "luxon"

// import pino from "pino"

// const logger = pino()

export function getDateNow(): DateTime {
  // Returns the current date in ISO format without time
  const date = DateTime.now()
  if (process.env.TZ) {
    // If a timezone is set, return the date in that timezone
    date.setZone(process.env.TZ)
  }

  // logger.info("Current time is %s", date.toISO())
  return date
}

export function getStartOfCurrentMonth(): string {
  const date = getDateNow().startOf("month").toISODate()
  if (!date) {
    throw new Error("Failed to get start of current month")
  }
  return date
}

export function getEndOfCurrentMonth(): string {
  const date = getDateNow().endOf("month").toISODate()
  if (!date) {
    throw new Error("Failed to get end of current month")
  }
  return date
}
