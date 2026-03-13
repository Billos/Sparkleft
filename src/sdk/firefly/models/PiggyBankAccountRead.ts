/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PiggyBankAccountRead = {
    /**
     * The ID of the account.
     */
    readonly account_id?: string;
    readonly name?: string;
    current_amount?: string;
    /**
     * If convertToPrimary is on, this will show the amount in the primary currency.
     */
    pc_current_amount?: string;
};

