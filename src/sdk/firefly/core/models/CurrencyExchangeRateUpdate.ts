/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CurrencyExchangeRateUpdate = {
    /**
     * The date to which the exchange rate is applicable.
     */
    date: string;
    /**
     * The exchange rate from the base currency to the destination currency.
     */
    rate: string;
    /**
     * The base currency code.
     */
    from?: string | null;
    /**
     * The destination currency code.
     */
    to?: string | null;
};

