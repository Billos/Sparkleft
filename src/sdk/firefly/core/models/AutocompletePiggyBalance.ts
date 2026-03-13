/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AutocompletePiggyBalance = {
    id: string;
    /**
     * Name of the piggy bank found by an auto-complete search.
     */
    name: string;
    /**
     * Name of the piggy bank found by an auto-complete search, including the currently saved amount and the target amount.
     */
    name_with_balance?: string;
    /**
     * Currency ID for the currency used by this piggy bank. This will always be the piggy bank's currency, never the primary currency.
     */
    currency_id?: string;
    /**
     * Currency code for the currency used by this piggy bank. This will always be the piggy bank's currency, never the primary currency.
     */
    currency_code?: string;
    /**
     * Currency symbol for the currency used by this piggy bank. This will always be the piggy bank's currency, never the primary currency.
     */
    currency_symbol?: string;
    /**
     * Currency decimal places for the currency used by this piggy bank. This will always be the piggy bank's currency, never the primary currency.
     */
    currency_decimal_places?: number;
    /**
     * The group ID of the group this object is part of. NULL if no group.
     */
    object_group_id?: string | null;
    /**
     * The name of the group. NULL if no group.
     */
    object_group_title?: string | null;
};

