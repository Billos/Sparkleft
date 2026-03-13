/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PiggyBankEventProperties = {
    created_at?: string;
    updated_at?: string;
    amount?: string;
    pc_amount?: string;
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
     * The journal associated with the event.
     */
    transaction_journal_id?: string | null;
    /**
     * The transaction group associated with the event.
     */
    transaction_group_id?: string | null;
};

