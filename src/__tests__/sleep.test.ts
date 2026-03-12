import { describe, expect, it } from "vitest"

import { sleep } from "../utils/sleep"

describe("sleep", () => {
  it("resolves after the specified delay", async () => {
    const start = Date.now()
    await sleep(50)
    const elapsed = Date.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(25)
  })

  it("resolves immediately when delay is 0", async () => {
    await expect(sleep(0)).resolves.toBeUndefined()
  })
})
