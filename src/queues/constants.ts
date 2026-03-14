export enum JobIds {
  CHECK_BUDGET_LIMIT = "check-budget-limit",
  UPDATE_LEFTOVERS_BUDGET_LIMIT = "update-leftovers-budget-limit",
  UPDATE_BILLS_BUDGET_LIMIT = "update-bills-budget-limit",
  UNBUDGETED_TRANSACTIONS = "unbudgeted-transactions",
  UNCATEGORIZED_TRANSACTIONS = "uncategorized-transactions",
  LINK_PAYPAL_TRANSACTIONS = "link-paypal-transactions",
  SET_CATEGORY_FOR_TRANSACTION = "set-category-for-transaction",
  SET_BUDGET_FOR_TRANSACTION = "set-budget-for-transaction",
  REMOVE_TRANSACTION_MESSAGES = "remove-transaction-messages",
  INIT = "init",
  AUTO_IMPORT = "auto-import",
}

export const JOB_DELAYS: Record<JobIds, number> = {
  [JobIds.CHECK_BUDGET_LIMIT]: 5,
  [JobIds.UPDATE_BILLS_BUDGET_LIMIT]: 15,
  [JobIds.UPDATE_LEFTOVERS_BUDGET_LIMIT]: 25,
  [JobIds.LINK_PAYPAL_TRANSACTIONS]: 35,
  [JobIds.UNBUDGETED_TRANSACTIONS]: 5,
  [JobIds.UNCATEGORIZED_TRANSACTIONS]: 10,
  [JobIds.SET_CATEGORY_FOR_TRANSACTION]: 0,
  [JobIds.SET_BUDGET_FOR_TRANSACTION]: 0,
  [JobIds.REMOVE_TRANSACTION_MESSAGES]: 15,
  [JobIds.INIT]: 0,
  [JobIds.AUTO_IMPORT]: 0,
}

export const ASAP_JOB_DELAY = 2000 // 2 seconds
