/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillRepeatFrequency } from './BillRepeatFrequency';
export type BillProperties = {
    readonly created_at?: string;
    readonly updated_at?: string;
    /**
     * The name of the subscription.
     */
    name?: string;
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
     * The minimum amount that is expected for this subscription in the subscription's currency.
     */
    amount_min?: string;
    /**
     * The minimum amount that is expected for this subscription in the administration's primary currency.
     */
    pc_amount_min?: string;
    /**
     * The maximum amount that is expected for this subscription in the subscription's currency.
     */
    amount_max?: string;
    /**
     * The maximum amount that is expected for this subscription in the administration's primary currency.
     */
    pc_amount_max?: string;
    /**
     * The average amount that is expected for this subscription in the subscription's currency.
     */
    amount_avg?: string;
    /**
     * The average amount that is expected for this subscription in the administration's primary currency.
     */
    pc_amount_avg?: string;
    date?: string;
    /**
     * The date after which this subscription is no longer valid or applicable
     */
    end_date?: string | null;
    /**
     * The date before which the subscription must be renewed (or cancelled)
     */
    extension_date?: string | null;
    repeat_freq?: BillRepeatFrequency;
    /**
     * How often the subscription will be skipped. 1 means a bi-monthly subscription.
     */
    skip?: number;
    /**
     * If the subscription is active.
     */
    active?: boolean;
    /**
     * Order of the subscription.
     */
    order?: number;
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
    /**
     * Array of past transactions when the subscription was paid.
     */
    readonly paid_dates?: Array<{
        /**
         * Transaction group ID of the transaction linked to this subscription.
         */
        readonly transaction_group_id?: string;
        /**
         * Transaction journal ID of the transaction linked to this subscription.
         */
        readonly transaction_journal_id?: string;
        /**
         * Date the bill was paid.
         */
        readonly date?: string;
        /**
         * ID of this subscription.
         */
        readonly subscription_id?: string;
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
         * The amount that was paid for this subscription in the subscription's currency.
         */
        amount?: string;
        /**
         * The amount that was paid for this subscription in the administration's primary currency.
         */
        pc_amount?: string;
        /**
         * The foreign amount that was paid for this subscription in the subscription's currency.
         */
        foreign_amount?: string;
        /**
         * The foreign amount that was paid for this subscription in the administration's primary currency.
         */
        pc_foreign_amount?: string;
    }>;
    /**
     * Array of future dates when the bill is expected to be paid. Autogenerated.
     */
    readonly pay_dates?: Array<string>;
    /**
     * When the subscription is expected to be due.
     */
    readonly next_expected_match?: string | null;
    /**
     * Formatted (locally) when the subscription is due.
     */
    readonly next_expected_match_diff?: string | null;
};

