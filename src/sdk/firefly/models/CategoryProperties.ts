/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArrayEntryWithCurrencyAndSum } from './ArrayEntryWithCurrencyAndSum';
export type CategoryProperties = {
    readonly created_at?: string;
    readonly updated_at?: string;
    name: string;
    notes?: string | null;
    /**
     * This object never has its own currency setting, so this value is always false.
     */
    object_has_currency_setting?: boolean;
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
     * Amount(s) spent in the currencies in the database for this category. ONLY present when start and date are set.
     */
    readonly spent?: Array<ArrayEntryWithCurrencyAndSum>;
    /**
     * Amount(s) spent in the primary currency in the database for this category. ONLY present when start and date are set.
     */
    readonly pc_spent?: Array<ArrayEntryWithCurrencyAndSum>;
    /**
     * Amount(s) earned in the currencies in the database for this category. ONLY present when start and date are set.
     */
    readonly earned?: Array<ArrayEntryWithCurrencyAndSum>;
    /**
     * Amount(s) earned in the primary currency in the database for this category. ONLY present when start and date are set.
     */
    readonly pc_earned?: Array<ArrayEntryWithCurrencyAndSum>;
    /**
     * Amount(s) transferred in the currencies in the database for this category. ONLY present when start and date are set.
     */
    readonly transferred?: Array<ArrayEntryWithCurrencyAndSum>;
    /**
     * Amount(s) transferred in primary currency in the database for this category. ONLY present when start and date are set.
     */
    readonly pc_transferred?: Array<ArrayEntryWithCurrencyAndSum>;
};

