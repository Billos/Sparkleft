/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CurrencyExchangeRateStore = {
    /**
     * The date to which the exchange rate is applicable.
     */
    date: string;
    /**
     * The base currency code.
     */
    from: string;
    /**
     * The destination currency code.
     */
    to: string;
    /**
     * The exchange rate from the base currency to the destination currency.
     */
    rate?: string;
};

