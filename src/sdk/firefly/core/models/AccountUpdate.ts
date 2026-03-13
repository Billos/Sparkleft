/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountRoleProperty } from './AccountRoleProperty';
import type { CreditCardTypeProperty } from './CreditCardTypeProperty';
import type { InterestPeriodProperty } from './InterestPeriodProperty';
import type { LiabilityTypeProperty } from './LiabilityTypeProperty';
export type AccountUpdate = {
    name: string;
    iban?: string | null;
    bic?: string | null;
    account_number?: string | null;
    opening_balance?: string;
    opening_balance_date?: string | null;
    virtual_balance?: string;
    /**
     * Use either currency_id or currency_code. Defaults to the user's financial administration's currency.
     */
    currency_id?: string;
    /**
     * Use either currency_id or currency_code. Defaults to the user's financial administration's currency.
     */
    currency_code?: string;
    /**
     * If omitted, defaults to true.
     */
    active?: boolean;
    /**
     * Order of the account
     */
    order?: number;
    /**
     * If omitted, defaults to true.
     */
    include_net_worth?: boolean;
    account_role?: AccountRoleProperty;
    credit_card_type?: CreditCardTypeProperty;
    /**
     * Mandatory when the account_role is ccAsset. Moment at which CC payment installments are asked for by the bank.
     */
    monthly_payment_date?: string | null;
    liability_type?: LiabilityTypeProperty;
    /**
     * Mandatory when type is liability. Interest percentage.
     */
    interest?: string | null;
    interest_period?: InterestPeriodProperty;
    notes?: string | null;
    /**
     * Latitude of the account's location, if applicable. Can be used to draw a map. If omitted, the existing location will be kept. If submitted as NULL, the current location will be removed.
     */
    latitude?: number | null;
    /**
     * Latitude of the account's location, if applicable. Can be used to draw a map. If omitted, the existing location will be kept. If submitted as NULL, the current location will be removed.
     */
    longitude?: number | null;
    /**
     * Zoom level for the map, if drawn. This to set the box right. Unfortunately this is a proprietary value because each map provider has different zoom levels. If omitted, the existing location will be kept. If submitted as NULL, the current location will be removed.
     */
    zoom_level?: number | null;
};

