/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountTypeProperty } from './AccountTypeProperty';
export type RecurrenceTransaction = {
    id?: string;
    description: string;
    /**
     * Indicates whether the object has a currency setting. If false, the object uses the administration's primary currency.
     */
    readonly object_has_currency_setting?: boolean;
    /**
     * The currency ID of the currency associated with this object.
     */
    currency_id?: string;
    /**
     * The currency name of the currency associated with this object.
     */
    currency_name?: string;
    /**
     * The currency code of the currency associated with this object.
     */
    currency_code?: string;
    readonly currency_symbol?: string;
    readonly currency_decimal_places?: number;
    /**
     * The currency ID of the administration's primary currency.
     */
    readonly primary_currency_id?: string;
    /**
     * The currency name of the administration's primary currency.
     */
    readonly primary_currency_name?: string;
    /**
     * The currency code of the administration's primary currency.
     */
    readonly primary_currency_code?: string;
    /**
     * The currency symbol of the administration's primary currency.
     */
    readonly primary_currency_symbol?: string;
    /**
     * The currency decimal places of the administration's primary currency.
     */
    readonly primary_currency_decimal_places?: number;
    /**
     * Amount of the transaction.
     */
    amount: string;
    /**
     * Amount of the transaction in primary currency.
     */
    pc_amount?: string;
    /**
     * Foreign amount of the transaction.
     */
    foreign_amount?: string | null;
    /**
     * Foreign amount of the transaction.
     */
    pc_foreign_amount?: string | null;
    foreign_currency_id?: string | null;
    foreign_currency_name?: string | null;
    foreign_currency_code?: string | null;
    readonly foreign_currency_symbol?: string | null;
    /**
     * Number of decimals in the currency
     */
    readonly foreign_currency_decimal_places?: number | null;
    /**
     * The budget ID for this transaction.
     */
    budget_id?: string;
    /**
     * The name of the budget to be used. If the budget name is unknown, the ID will be used or the value will be ignored.
     */
    readonly budget_name?: string | null;
    /**
     * Category ID for this transaction.
     */
    category_id?: string;
    /**
     * Category name for this transaction.
     */
    category_name?: string;
    /**
     * ID of the source account. Submit either this or source_name.
     */
    source_id?: string;
    /**
     * Name of the source account. Submit either this or source_id.
     */
    source_name?: string;
    readonly source_iban?: string | null;
    source_type?: AccountTypeProperty;
    /**
     * ID of the destination account. Submit either this or destination_name.
     */
    destination_id?: string;
    /**
     * Name of the destination account. Submit either this or destination_id.
     */
    destination_name?: string;
    readonly destination_iban?: string | null;
    destination_type?: AccountTypeProperty;
    /**
     * Array of tags.
     */
    tags?: Array<string> | null;
    piggy_bank_id?: string | null;
    piggy_bank_name?: string | null;
    subscription_id?: string | null;
    subscription_name?: string | null;
};

