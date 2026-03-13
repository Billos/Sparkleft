/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArrayEntryWithCurrencyAndSum } from './ArrayEntryWithCurrencyAndSum';
export type AvailableBudgetProperties = {
    readonly created_at?: string;
    readonly updated_at?: string;
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
     * The amount of this available budget in the currency of this available budget.
     */
    amount?: string;
    /**
     * The amount of this available budget in the primary currency (pc) of this administration.
     */
    pc_amount?: string;
    /**
     * Start date of the available budget.
     */
    start?: string;
    /**
     * End date of the available budget.
     */
    end?: string;
    readonly spent_in_budgets?: Array<ArrayEntryWithCurrencyAndSum>;
    /**
     * The amount spent in budgets in the primary currency (pc) of this administration.
     *
     */
    readonly pc_spent_in_budgets?: Array<ArrayEntryWithCurrencyAndSum>;
    readonly spent_outside_budgets?: Array<ArrayEntryWithCurrencyAndSum>;
    /**
     * The amount spent outside of budgets in the primary currency (pc) of this administration.
     *
     */
    readonly pc_spent_outside_budgets?: Array<ArrayEntryWithCurrencyAndSum>;
};

