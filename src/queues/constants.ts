export enum JobIds {
  CHECK_BUDGET_LIMIT = "check-budget-limit",
  UPDATE_LEFTOVERS_BUDGET_LIMIT = "update-leftovers-budget-limit",
  UPDATE_BILLS_BUDGET_LIMIT = "update-bills-budget-limit",
  UNBUDGETED_TRANSACTIONS = "unbudgeted-transactions",
  UNCATEGORIZED_TRANSACTIONS = "uncategorized-transactions",
  LINK_PAYPAL_TRANSACTIONS = "link-paypal-transactions",
  SET_TRANSACTION_ATTRIBUTES = "set-transaction-attributes",
  INIT = "init",
}

export const JOB_DELAYS: Record<JobIds, number> = {
  [JobIds.CHECK_BUDGET_LIMIT]: 5,
  [JobIds.UPDATE_BILLS_BUDGET_LIMIT]: 15,
  [JobIds.UPDATE_LEFTOVERS_BUDGET_LIMIT]: 25,
  [JobIds.LINK_PAYPAL_TRANSACTIONS]: 35,
  [JobIds.UNBUDGETED_TRANSACTIONS]: 5,
  [JobIds.UNCATEGORIZED_TRANSACTIONS]: 10,
  [JobIds.SET_TRANSACTION_ATTRIBUTES]: 0,
  [JobIds.INIT]: 0,
}

export const ASAP_JOB_DELAY = 2000 // 2 seconds
