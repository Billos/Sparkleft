/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PiggyBankAccountRead } from './PiggyBankAccountRead';
export type PiggyBankProperties = {
    readonly created_at?: string;
    readonly updated_at?: string;
    name: string;
    /**
     * The percentage of the target amount that has been saved, if a target amount is set.
     */
    readonly percentage?: number | null;
    /**
     * The date you started with this piggy bank.
     */
    start_date?: string;
    /**
     * The date you intend to finish saving money.
     */
    target_date?: string | null;
    order?: number;
    readonly active?: boolean;
    notes?: string | null;
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
    accounts?: Array<PiggyBankAccountRead>;
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
    target_amount: string | null;
    /**
     * The target amount in the primary currency of the administration.
     */
    pc_target_amount?: string | null;
    current_amount?: string;
    /**
     * The current amount in the primary currency of the administration.
     */
    pc_current_amount?: string;
    left_to_save?: string | null;
    pc_left_to_save?: string | null;
    readonly save_per_month?: string | null;
    readonly pc_save_per_month?: string | null;
};

