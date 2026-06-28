import { DateTime } from "luxon"
import { afterEach, describe, expect, it, vi } from "vitest"

import { getDateNow, getEndOfCurrentMonth, getStartOfCurrentMonth } from "../utils/date"

describe("getDateNow", () => {
  it("returns a valid DateTime object", () => {
    const date = getDateNow()
    expect(date.isValid).toBe(true)
  })

  it("returns a DateTime close to the current time", () => {
    const before = Date.now()
    const date = getDateNow()
    const after = Date.now()

    const dateMs = date.toMillis()
    expect(dateMs).toBeGreaterThanOrEqual(before)
    expect(dateMs).toBeLessThanOrEqual(after)
  })
})

describe("getStartOfCurrentMonth", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns an ISO date string (YYYY-MM-DD)", () => {
    const result = getStartOfCurrentMonth()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it("returns the first day of the current month", () => {
    const result = getStartOfCurrentMonth()
    const expected = DateTime.now().startOf("month").toISODate()
    expect(result).toBe(expected)
  })

  it("always returns a date ending in -01", () => {
    const result = getStartOfCurrentMonth()
    expect(result.endsWith("-01")).toBe(true)
  })

  it("returns the first day for a mocked date in the middle of a month", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-03-15T12:34:56Z"))

    expect(getStartOfCurrentMonth()).toBe("2024-03-01")
  })

  it("returns the first day for a mocked date on the last day of a month", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-12-31T23:59:59Z"))

    expect(getStartOfCurrentMonth()).toBe("2024-12-01")
  })
})

describe("getEndOfCurrentMonth", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns an ISO date string (YYYY-MM-DD)", () => {
    const result = getEndOfCurrentMonth()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it("returns the last day of the current month", () => {
    const result = getEndOfCurrentMonth()
    const expected = DateTime.now().endOf("month").toISODate()
    expect(result).toBe(expected)
  })

  it("returns the last day for a mocked date in the middle of a month", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-03-15T12:34:56Z"))

    expect(getEndOfCurrentMonth()).toBe("2024-03-31")
  })

  it("handles February in a leap year", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-02-10T00:00:00Z"))

    expect(getEndOfCurrentMonth()).toBe("2024-02-29")
  })

  it("handles February in a non-leap year", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2023-02-10T00:00:00Z"))

    expect(getEndOfCurrentMonth()).toBe("2023-02-28")
  })

  it("returns a date after getStartOfCurrentMonth", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"))

    const start = getStartOfCurrentMonth()
    const end = getEndOfCurrentMonth()
    expect(end >= start).toBe(true)
  })
})
