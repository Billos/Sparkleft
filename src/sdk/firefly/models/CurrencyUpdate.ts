/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CurrencyUpdate = {
    /**
     * If the currency is enabled
     */
    enabled?: boolean;
    /**
     * If the currency must be the primary for the user. You can only submit TRUE. Submitting FALSE will not drop this currency as the primary currency, because then the system would be without one.
     */
    primary?: boolean;
    /**
     * The currency code
     */
    code?: string;
    /**
     * The currency name
     */
    name?: string;
    /**
     * The currency symbol
     */
    symbol?: string;
    /**
     * How many decimals to use when displaying this currency. Between 0 and 16.
     */
    decimal_places?: number;
};

