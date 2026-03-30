import { BudgetsService } from "@billos/firefly-iii-sdk"

import { client } from "../client"

export async function getBudgetName(id: string): Promise<string | null> {
  try {
    const {
      data: { data: budget },
    } = await BudgetsService.getBudget({ client, path: { id } })
    return budget.attributes.name
  } catch (error) {
    return null
  }
}
