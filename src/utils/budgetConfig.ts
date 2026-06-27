import { billsBudgetIdKey, leftoversBudgetIdKey, redis } from "../redis"

export enum BudgetRole {
  Bills = "bills",
  Leftovers = "leftovers",
}

const roleKeys: Record<BudgetRole, string> = {
  [BudgetRole.Bills]: billsBudgetIdKey,
  [BudgetRole.Leftovers]: leftoversBudgetIdKey,
}

// Reads the configured budget id for a role from Redis, falling back to the
// value provided through environment variables for backward compatibility.
export async function getBudgetRoleId(role: BudgetRole): Promise<string | null> {
  return redis.get(roleKeys[role])
}

// Stores the budget id for a role in Redis. Passing an empty value clears it.
export async function setBudgetRoleId(role: BudgetRole, budgetId: string): Promise<void> {
  if (!budgetId) {
    await redis.del(roleKeys[role])
    return
  }
  await redis.set(roleKeys[role], budgetId)
}
