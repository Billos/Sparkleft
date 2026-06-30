import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getEndOfCurrentMonth, getStartOfCurrentMonth } from "../utils/date"

vi.mock("../config", () => ({
  env: { timezone: "UTC" },
}))

describe("getStartOfCurrentMonth", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the first day for a mocked date in the first day of a month", () => {
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"))
    expect(getStartOfCurrentMonth()).toBe("2024-01-01")
  })

  it("returns the first day for a mocked date in the middle of a month", () => {
    vi.setSystemTime(new Date("2024-03-15T12:34:56Z"))
    expect(getStartOfCurrentMonth()).toBe("2024-03-01")
  })

  it("returns the first day for a mocked date on the last day of a month", () => {
    vi.setSystemTime(new Date("2024-12-31T23:59:59Z"))
    expect(getStartOfCurrentMonth()).toBe("2024-12-01")
  })
})

describe("getEndOfCurrentMonth", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the last day for a mocked date in the first day of a month", () => {
    vi.setSystemTime(new Date("2024-02-01T00:00:00Z"))
    expect(getEndOfCurrentMonth()).toBe("2024-02-29")
  })

  it("returns the last day for a mocked date in the middle of a month", () => {
    vi.setSystemTime(new Date("2024-03-15T12:34:56Z"))
    expect(getEndOfCurrentMonth()).toBe("2024-03-31")
  })

  it("returns the last day for a mocked date on the last day of a month", () => {
    vi.setSystemTime(new Date("2024-12-31T23:59:59Z"))
    expect(getEndOfCurrentMonth()).toBe("2024-12-31")
  })
})
