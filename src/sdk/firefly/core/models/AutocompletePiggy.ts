/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AutocompletePiggy = {
    id: string;
    /**
     * Name of the piggy bank found by an auto-complete search.
     */
    name: string;
    /**
     * Currency ID for this piggy bank. This will always be the currency of the piggy bank, never the user's primary currency.
     */
    currency_id?: string;
    /**
     * Currency code for this piggy bank. This will always be the currency of the piggy bank, never the user's primary currency.
     */
    currency_code?: string;
    currency_symbol?: string;
    /**
     * Currency name for the currency used by this piggy bank. This will always be the currency of the piggy bank, never the user's primary currency.
     */
    currency_name?: string;
    /**
     * Number of decimal places for the currency used by this piggy bank. This will always be the currency of the piggy bank, never the user's primary currency.
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

