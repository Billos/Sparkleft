/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyExchangeProperties } from './CurrencyExchangeProperties';
import type { ObjectLink } from './ObjectLink';
export type CurrencyExchangeRateRead = {
    /**
     * Immutable value
     */
    readonly type?: string;
    readonly id?: string;
    attributes?: CurrencyExchangeProperties;
    links?: ObjectLink;
};

