/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArrayEntryWithCurrencyAndSum } from './ArrayEntryWithCurrencyAndSum';
import type { AutoBudgetPeriod } from './AutoBudgetPeriod';
import type { AutoBudgetType } from './AutoBudgetType';
export type BudgetProperties = {
    readonly created_at?: string;
    readonly updated_at?: string;
    active?: boolean;
    name: string;
    readonly order?: number;
    notes?: string | null;
    auto_budget_type?: AutoBudgetType;
    auto_budget_period?: AutoBudgetPeriod;
    /**
     * The group ID of the group this object is part of. NULL if no group.
     */
    object_group_id?: string | null;
    /**
     * The order of the group. At least 1, for the highest sorting.
     */
    readonly object_group_order?: number | null;
    /**
     * The name of the group. NULL if no group.
     */
    object_group_title?: string | null;
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
     * The amount for the auto-budget, if set.
     */
    auto_budget_amount?: string | null;
    /**
     * The amount for the auto-budget, if set in the primary currency of the administration.
     */
    pc_auto_budget_amount?: string | null;
    /**
     * Information on how much was spent in this budget. Is only filled in when the start and end date are submitted.
     */
    readonly spent?: Array<ArrayEntryWithCurrencyAndSum>;
    /**
     * Information on how much was spent in this budget. Is only filled in when the start and end date are submitted. It is converted to the primary currency of the administration.
     */
    readonly pc_spent?: Array<ArrayEntryWithCurrencyAndSum>;
};

