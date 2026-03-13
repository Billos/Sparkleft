/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CurrencyProperties = {
    readonly created_at?: string;
    readonly updated_at?: string;
    /**
     * Defaults to true
     */
    enabled?: boolean;
    /**
     * Is the primary currency?
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

