import { BudgetsService } from "../sdk/firefly"

export async function getBudgetName(budgetId: string): Promise<string | null> {
  try {
    const { data: budget } = await BudgetsService.getBudget(budgetId)
    return budget.attributes.name
  } catch (error) {
    return null
  }
}
