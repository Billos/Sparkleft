/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObjectLink } from './ObjectLink';
import type { PiggyBankEventProperties } from './PiggyBankEventProperties';
export type PiggyBankEventRead = {
    /**
     * Immutable value
     */
    type: string;
    id: string;
    attributes: PiggyBankEventProperties;
    links: ObjectLink;
};

