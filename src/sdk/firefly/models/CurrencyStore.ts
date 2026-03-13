/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CurrencyStore = {
    /**
     * Defaults to true
     */
    enabled?: boolean;
    /**
     * Make this currency the primary currency for the current administration. You can set this value to FALSE, in which case nothing will change to the primary currency. If you set it to TRUE, the current primary currency will no longer be the primary currency.
     */
    primary?: boolean;
    code: string;
    name: string;
    symbol: string;
    /**
     * Supports 0-16 decimals.
     */
    decimal_places?: number;
};

