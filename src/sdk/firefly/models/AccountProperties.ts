/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountRoleProperty } from './AccountRoleProperty';
import type { CreditCardTypeProperty } from './CreditCardTypeProperty';
import type { InterestPeriodProperty } from './InterestPeriodProperty';
import type { LiabilityDirectionProperty } from './LiabilityDirectionProperty';
import type { LiabilityTypeProperty } from './LiabilityTypeProperty';
import type { ShortAccountTypeProperty } from './ShortAccountTypeProperty';
export type AccountProperties = {
    readonly created_at?: string;
    readonly updated_at?: string;
    active?: boolean;
    /**
     * Order of the account. Is NULL if account is not asset or liability.
     */
    order?: number | null;
    name: string;
    type: ShortAccountTypeProperty;
    account_role?: AccountRoleProperty;
    /**
     * The group ID of the group this object is part of. NULL if no group.
     */
    object_group_id?: string | null;
    /**
     * The order of the group. At least 1, for the highest sorting.
     */
    readonly object_group_order?: number | null;
    /**
     * The name of the group. NULL if no group.
     */
    object_group_title?: string | null;
    /**
     * Indicates whether the account has a currency setting. If false, the account uses the administration's primary currency. Asset accounts and liability accounts always have a currency setting, while expense and revenue accounts do not.
     */
    readonly object_has_currency_setting?: boolean;
    /**
     * The currency ID of the currency associated with this object.
     */
    currency_id?: string;
    /**
     * The currency name of the currency associated with this object.
     */
    currency_name?: string;
    /**
     * The currency code of the currency associated with this object.
     */
    currency_code?: string;
    readonly currency_symbol?: string;
    readonly currency_decimal_places?: number;
    /**
     * The currency ID of the administration's primary currency.
     */
    readonly primary_currency_id?: string;
    /**
     * The currency name of the administration's primary currency.
     */
    readonly primary_currency_name?: string;
    /**
     * The currency code of the administration's primary currency.
     */
    readonly primary_currency_code?: string;
    /**
     * The currency symbol of the administration's primary currency.
     */
    readonly primary_currency_symbol?: string;
    /**
     * The currency decimal places of the administration's primary currency.
     */
    readonly primary_currency_decimal_places?: number;
    /**
     * The current balance of the account in the account's currency. If the account has no currency, this is the balance in the administration's primary currency. Either way, the `currency_*` fields reflect the currency used.
     */
    readonly current_balance?: string;
    /**
     * The current balance of the account in the administration's primary currency. The `primary_currency_*` fields reflect the currency used. This field is NULL if the user does have 'convert to primary' set to true in their settings.
     */
    readonly pc_current_balance?: string | null;
    /**
     * If you submit a start AND end date, this will be the difference between those two moments.
     */
    readonly balance_difference?: string;
    /**
     * If you submit a start AND end date, this will be the difference in the currency of the account or the administration's primary currency between those two moments.
     */
    readonly pc_balance_difference?: string | null;
    /**
     * Represents the opening balance, the initial amount this account holds in the currency of the account or the administration's primary currency if the account has no currency. Either way, the `currency_*` fields reflect the currency used.
     */
    opening_balance?: string;
    /**
     * The opening balance of the account in the administration's primary currency (pc). The `primary_currency_*` fields reflect the currency used. This field is NULL if the user does have 'convert to primary' set to true in their settings.
     */
    pc_opening_balance?: string;
    /**
     * The virtual balance of the account in the account's currency or the administration's primary currency if the account has no currency.
     */
    virtual_balance?: string;
    /**
     * The virtual balance of the account in the administration's primary currency (pc). The `primary_currency_*` fields reflect the currency used. This field is NULL if the user does have 'convert to primary' set to true in their settings.
     */
    pc_virtual_balance?: string;
    /**
     * In liability accounts (loans, debts and mortgages), this is the amount of debt in the account's currency (see the `currency_*` fields). In asset accounts, this is NULL.
     */
    debt_amount?: string | null;
    /**
     * In liability accounts (loans, debts and mortgages), this is the amount of debt in the administration's primary currency (see the `currency_*` fields. In asset accounts, this is NULL.
     */
    pc_debt_amount?: string | null;
    /**
     * The timestamp for this date is always 23:59:59, to indicate it's the balance at the very END of that particular day.
     */
    readonly current_balance_date?: string;
    notes?: string | null;
    /**
     * Mandatory when the account_role is ccAsset. Moment at which CC payment installments are asked for by the bank.
     */
    monthly_payment_date?: string | null;
    credit_card_type?: CreditCardTypeProperty;
    account_number?: string | null;
    iban?: string | null;
    bic?: string | null;
    /**
     * Represents the date of the opening balance.
     */
    opening_balance_date?: string | null;
    liability_type?: LiabilityTypeProperty;
    liability_direction?: LiabilityDirectionProperty;
    /**
     * Mandatory when type is liability. Interest percentage.
     */
    interest?: string | null;
    interest_period?: InterestPeriodProperty;
    include_net_worth?: boolean;
    /**
     * Latitude of the accounts's location, if applicable. Can be used to draw a map.
     */
    longitude?: number | null;
    /**
     * Latitude of the accounts's location, if applicable. Can be used to draw a map.
     */
    latitude?: number | null;
    /**
     * Zoom level for the map, if drawn. This to set the box right. Unfortunately this is a proprietary value because each map provider has different zoom levels.
     */
    zoom_level?: number | null;
    /**
     * Last activity of the account.
     */
    last_activity?: string | null;
};

