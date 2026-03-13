/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChartDatasetPeriodProperty } from './ChartDatasetPeriodProperty';
export type ChartDataSet = {
    /**
     * This is the title of the current set. It can refer to an account, a budget or another object (by name).
     */
    label?: string;
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
    date?: string;
    start_date?: string;
    end_date?: string;
    /**
     * Indicated the type of chart that is expected to be rendered. You can safely ignore this if you want.
     */
    type?: string;
    period?: ChartDatasetPeriodProperty;
    /**
     * Used to indicate the Y axis for this data set. Is usually between 0 and 1 (left and right side of the chart).
     */
    yAxisID?: number;
    /**
     * The actual entries for this data set. They 'key' value is the label for the data point. The value is the actual (numerical) value.
     */
    entries?: Record<string, any>;
    /**
     * The actual entries for this data set. They 'key' value is the label for the data point. The value is the actual (numerical) value.
     */
    pc_entries?: Record<string, any>;
};

