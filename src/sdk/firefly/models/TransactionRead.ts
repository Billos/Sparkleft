/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObjectLink } from './ObjectLink';
import type { Transaction } from './Transaction';
export type TransactionRead = {
    /**
     * Immutable value
     */
    type: string;
    id: string;
    attributes: Transaction;
    links: ObjectLink;
};

