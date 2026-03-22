import { AutoImportJob } from "./autoImport"
import { BudgetJob, EndpointJob, SimpleJob, TransactionJob } from "./BaseJob"
import { CheckBudgetLimitJob } from "./checkBudgetLimit"
import { LinkPaypalTransactionsJob } from "./linkPaypalTransactions"
import { RemoveTransactionMessagesJob } from "./removeTransactionMessages"
import { SetBudgetForTransactionJob } from "./setBudgetForTransaction"
import { SetCategoryForTransactionJob } from "./setCategoryForTransaction"
import { UnbudgetedTransactionsJob } from "./unbudgetedTransactions"
import { UncategorizedTransactionsJob } from "./uncategorizedTransactions"
import { UpdateBillsBudgetLimitJob } from "./updateBillsBudgetLimit"
import { UpdateLeftoverBudgetLimitJob } from "./updateLeftoverBudgetLimit"

export const simpleJobs: SimpleJob[] = [
  new UpdateLeftoverBudgetLimitJob(),
  new UpdateBillsBudgetLimitJob(),
  new LinkPaypalTransactionsJob(),
  new AutoImportJob(),
]

export const transactionJobs: TransactionJob[] = [
  new UnbudgetedTransactionsJob(),
  new UncategorizedTransactionsJob(),
  new RemoveTransactionMessagesJob(),
]

export const budgetJobs: BudgetJob[] = [new CheckBudgetLimitJob()]

export const endpointJobs: EndpointJob[] = [new SetCategoryForTransactionJob(), new SetBudgetForTransactionJob()]
