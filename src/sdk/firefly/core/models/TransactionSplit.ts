/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountTypeProperty } from './AccountTypeProperty';
import type { TransactionTypeProperty } from './TransactionTypeProperty';
export type TransactionSplit = {
    /**
     * User ID
     */
    readonly user?: string;
    /**
     * ID of the underlying transaction journal. Each transaction consists of a transaction group (see the top ID) and one or more journals
     * making up the splits of the transaction.
     *
     */
    readonly transaction_journal_id?: string;
    type: TransactionTypeProperty;
    /**
     * Date of the transaction
     */
    date: string;
    /**
     * Order of this entry in the list of transactions.
     */
    order?: number | null;
    /**
     * Indicates whether the transaction has a currency setting. For transactions this is always true.
     */
    readonly object_has_currency_setting?: boolean;
    /**
     * Currency ID for the currency of this transaction.
     */
    currency_id?: string;
    /**
     * Currency code for the currency of this transaction.
     */
    currency_code?: string;
    /**
     * Currency symbol for the currency of this transaction.
     */
    readonly currency_symbol?: string;
    /**
     * Currency name for the currency of this transaction.
     */
    currency_name?: string;
    /**
     * Number of decimals used in this currency.
     */
    currency_decimal_places?: number;
    /**
     * Currency ID of the foreign currency, if this transaction has a foreign amount.
     */
    foreign_currency_id?: string | null;
    /**
     * Currency code of the foreign currency. Default is NULL.
     */
    foreign_currency_code?: string | null;
    readonly foreign_currency_symbol?: string | null;
    /**
     * Number of decimals in the foreign currency.
     */
    readonly foreign_currency_decimal_places?: number | null;
    /**
     * Returns the primary currency ID of the administration. This currency is used as the currency for all `pc_*` amount and balance fields of this account.
     */
    readonly primary_currency_id?: string | null;
    /**
     * Returns the primary currency code of the administration. This currency is used as the currency for all `pc_*` amount and balance fields of this account.
     */
    primary_currency_code?: string | null;
    /**
     * See the other `primary_*` fields.
     */
    readonly primary_currency_symbol?: string | null;
    /**
     * See the other `primary_*` fields.
     */
    readonly primary_currency_decimal_places?: number | null;
    /**
     * Amount of the transaction.
     */
    amount: string;
    /**
     * Amount of the transaction in the primary currency of this administration. The `primary_currency_*` fields reflect the currency used. This field is NULL if the user does have 'convert to primary' set to true in their settings.
     */
    pc_amount?: string;
    /**
     * The amount in the set foreign currency. May be NULL if the transaction does not have a foreign amount.
     */
    foreign_amount?: string | null;
    /**
     * Foreign amount of the transaction in the primary currency of this administration. The `primary_currency_*` fields reflect the currency used. This field is NULL if the user does have 'convert to primary' set to true in their settings.
     */
    pc_foreign_amount?: string;
    /**
     * The balance of the source account. This is the balance in the account's currency which may be different from this transaction, and is not provided in this model.
     */
    source_balance_after?: string | null;
    /**
     * The balance of the source account in the primary currency of this administration. The `primary_currency_*` fields reflect the currency used. This field is NULL if the user does have 'convert to primary' set to true in their settings.
     */
    pc_source_balance_after?: string | null;
    /**
     * The balance of the destination account. This is the balance in the account's currency which may be different from this transaction, and is not provided in this model.
     */
    destination_balance_after?: string | null;
    /**
     * The balance of the destination account in the primary currency of this administration. The `primary_currency_*` fields reflect the currency used. This field is NULL if the user does have 'convert to primary' set to true in their settings.
     */
    pc_destination_balance_after?: string | null;
    /**
     * Description of the transaction.
     */
    description: string;
    /**
     * ID of the source account. For a withdrawal or a transfer, this must always be an asset account. For deposits, this must be a revenue account.
     */
    source_id: string | null;
    /**
     * Name of the source account. For a withdrawal or a transfer, this must always be an asset account. For deposits, this must be a revenue account. Can be used instead of the source_id. If the transaction is a deposit, the source_name can be filled in freely: the account will be created based on the name.
     */
    source_name?: string | null;
    readonly source_iban?: string | null;
    source_type?: AccountTypeProperty;
    /**
     * ID of the destination account. For a deposit or a transfer, this must always be an asset account. For withdrawals this must be an expense account.
     */
    destination_id: string | null;
    /**
     * Name of the destination account. You can submit the name instead of the ID. For everything except transfers, the account will be auto-generated if unknown, so submitting a name is enough.
     */
    destination_name?: string | null;
    readonly destination_iban?: string | null;
    destination_type?: AccountTypeProperty;
    /**
     * The budget ID for this transaction.
     */
    budget_id?: string | null;
    /**
     * The name of the budget used.
     */
    readonly budget_name?: string | null;
    /**
     * The category ID for this transaction.
     */
    category_id?: string | null;
    /**
     * The name of the category to be used. If the category is unknown, it will be created. If the ID and the name point to different categories, the ID overrules the name.
     */
    category_name?: string | null;
    /**
     * The associated subscription ID for this transaction. `bill` refers to the OLD name for subscriptions and this field will be removed.
     */
    bill_id?: string | null;
    /**
     * The associated subscription name for this transaction. `bill` refers to the OLD name for subscriptions and this field will be removed.
     */
    bill_name?: string | null;
    /**
     * The associated subscription ID for this transaction.
     */
    subscription_id?: string | null;
    /**
     * The associated subscription name for this transaction.
     */
    subscription_name?: string | null;
    /**
     * If the transaction has been reconciled already. When you set this, the amount can no longer be edited by the user.
     */
    reconciled?: boolean;
    notes?: string | null;
    /**
     * Array of tags.
     */
    tags?: Array<string> | null;
    /**
     * Reference to internal reference of other systems.
     */
    internal_reference?: string | null;
    /**
     * Reference to external ID in other systems.
     */
    external_id?: string | null;
    /**
     * External, custom URL for this transaction.
     */
    external_url?: string | null;
    /**
     * System generated identifier for original creator of transaction.
     */
    readonly original_source?: string | null;
    /**
     * Reference to recurrence that made the transaction.
     */
    readonly recurrence_id?: string | null;
    /**
     * Total number of transactions expected to be created by this recurrence repetition. Will be 0 if infinite.
     */
    readonly recurrence_total?: number | null;
    /**
     * The # of the current transaction created under this recurrence.
     */
    readonly recurrence_count?: number | null;
    /**
     * Hash value of original import transaction (for duplicate detection).
     */
    readonly import_hash_v2?: string | null;
    /**
     * SEPA Clearing Code
     */
    sepa_cc?: string | null;
    /**
     * SEPA Opposing Account Identifier
     */
    sepa_ct_op?: string | null;
    /**
     * SEPA end-to-end Identifier
     */
    sepa_ct_id?: string | null;
    /**
     * SEPA mandate identifier
     */
    sepa_db?: string | null;
    /**
     * SEPA Country
     */
    sepa_country?: string | null;
    /**
     * SEPA External Purpose indicator
     */
    sepa_ep?: string | null;
    /**
     * SEPA Creditor Identifier
     */
    sepa_ci?: string | null;
    /**
     * SEPA Batch ID
     */
    sepa_batch_id?: string | null;
    interest_date?: string | null;
    book_date?: string | null;
    process_date?: string | null;
    due_date?: string | null;
    payment_date?: string | null;
    invoice_date?: string | null;
    /**
     * Latitude of the transaction's location, if applicable. Can be used to draw a map.
     */
    latitude?: number | null;
    /**
     * Latitude of the transaction's location, if applicable. Can be used to draw a map.
     */
    longitude?: number | null;
    /**
     * Zoom level for the map, if drawn. This to set the box right. Unfortunately this is a proprietary value because each map provider has different zoom levels.
     */
    zoom_level?: number | null;
    /**
     * If the transaction has attachments.
     */
    has_attachments?: boolean;
};

