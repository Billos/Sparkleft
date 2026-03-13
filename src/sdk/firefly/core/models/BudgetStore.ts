/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoBudgetPeriod } from './AutoBudgetPeriod';
import type { AutoBudgetType } from './AutoBudgetType';
export type BudgetStore = {
    name: string;
    active?: boolean;
    readonly order?: number;
    notes?: string | null;
    /**
     * Whether or not to fire the webhooks that are related to this event.
     */
    fire_webhooks?: boolean;
    auto_budget_type?: AutoBudgetType;
    /**
     * Use either currency_id or currency_code. Defaults to the user's financial administration's currency.
     */
    auto_budget_currency_id?: string | null;
    /**
     * Use either currency_id or currency_code. Defaults to the user's financial administration's currency.
     */
    auto_budget_currency_code?: string | null;
    auto_budget_amount?: string | null;
    auto_budget_period?: AutoBudgetPeriod;
};

