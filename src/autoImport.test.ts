import { AboutService, CronResult } from "@firefly";

describe("@firefly auto import", () => {
  it("should import AboutService from @firefly", () => {
    expect(AboutService).toBeDefined();
  });

  it("should resolve CronResult type from @firefly", () => {
    const result: CronResult = { auto_budgets: undefined, recurring_transactions: undefined, telemetry: undefined };
    expect(result).toBeDefined();
  });
});
