// import pino from "pino"

// const logger = pino()

export function getStartOfCurrentMonth(): string {
  const date = new Date()
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const startOfMonth = new Date(Date.UTC(year, month, 1))
  return startOfMonth.toISOString().split("T")[0]
}

export function getEndOfCurrentMonth(): string {
  const date = new Date()
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const endOfMonth = new Date(Date.UTC(year, month + 1, 0))
  return endOfMonth.toISOString().split("T")[0]
}
