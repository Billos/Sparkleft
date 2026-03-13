/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CurrencyExchangeRateStoreByDate = {
    /**
     * The 'from'-currency
     */
    from: string;
    /**
     * The actual entries for this data set. They 'key' value is 'to' currency. The value is the exchange rate.
     */
    rates: Record<string, string>;
};

