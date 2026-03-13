/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CurrencyExchangeProperties = {
    readonly created_at?: string;
    readonly updated_at?: string;
    /**
     * Base currency ID for this exchange rate entry.
     */
    readonly from_currency_id?: string;
    /**
     * Base currency name for this exchange rate entry.
     */
    readonly from_currency_name?: string;
    /**
     * Base currency code for this exchange rate entry.
     */
    readonly from_currency_code?: string;
    /**
     * Base currency symbol for this exchange rate entry.
     */
    readonly from_currency_symbol?: string;
    /**
     * Base currency decimal places for this exchange rate entry.
     */
    readonly from_currency_decimal_places?: number;
    /**
     * Destination currency ID for this exchange rate entry.
     */
    readonly to_currency_id?: string;
    /**
     * Destination currency name for this exchange rate entry.
     */
    readonly to_currency_name?: string;
    /**
     * Destination currency code for this exchange rate entry.
     */
    readonly to_currency_code?: string;
    /**
     * Destination currency symbol for this exchange rate entry.
     */
    readonly to_currency_symbol?: string;
    /**
     * Destination currency decimal places for this exchange rate entry.
     */
    readonly to_currency_decimal_places?: number;
    /**
     * The actual exchange rate. How many 'to' currency will you get for 1 'from' currency?
     */
    readonly rate?: string;
    /**
     * Date and time of the exchange rate.
     */
    readonly date?: string;
};

