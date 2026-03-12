import { describe, expect, it } from "vitest"

import { getDateNow } from "../utils/date"

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
