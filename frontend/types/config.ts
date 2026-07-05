export interface BudgetAttributes {
  name: string
}

export interface Budget {
  id: string
  attributes?: BudgetAttributes
}

export interface CategoryAttributes {
  name: string
}

export interface Category {
  id: string
  attributes?: CategoryAttributes
}

export interface About {
  name: string
  version: string
  author: string
  license: string
  source: string
  description: string
  repository: string
}

export interface Config {
  about: About
  token?: string
  budgets?: Budget[]
  categories?: Category[]
  hiddenBudgets?: string[]
  hiddenCategories?: string[]
  billsBudgetId?: string
  leftoversBudgetId?: string
  autoImportCron: string
  budgetSumUpCron: string
}
