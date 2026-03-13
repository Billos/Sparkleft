/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChartLine } from '../models/ChartLine';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChartsService {
    /**
     * Dashboard chart with asset account balance information.
     * This endpoint returns the data required to generate a chart with basic asset account balance information. This is used on the dashboard.
     *
     * @param start A date formatted YYYY-MM-DD.
     *
     * @param end A date formatted YYYY-MM-DD.
     *
     * @param xTraceId Unique identifier associated with this request.
     * @param period Optional period to group the data by. If not provided, it will default to '1M' or whatever is deemed relevant for the range provided.
     *
     * If you want to know which periods are available, see the enums or get the configuration value: `GET /api/v1/configuration/firefly.valid_view_ranges`
     *
     * @param preselected Optional set of preselected accounts to limit the chart to. This may be easier than submitting all asset accounts manually, for example.
     * If you want to know which selection are available, see the enums here or get the configuration value: `GET /api/v1/configuration/firefly.preselected_accounts`
     *
     * - `empty`: do not do a pre-selection
     * - `all`: select all asset and all liability accounts
     * - `assets`: select all asset accounts
     * - `liabilities`: select all liability accounts
     *
     * If no accounts are found, the user's "frontpage accounts" preference will be used. If that is empty, all asset accounts will be used.
     *
     * @returns ChartLine Line chart oriented chart information. Check out the model for more details. Each entry is a line (or bar) in the chart.
     * @throws ApiError
     */
    public static getChartAccountOverview(
        start: string,
        end: string,
        xTraceId?: string,
        period?: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y',
        preselected?: 'empty' | 'all' | 'assets' | 'liabilities',
    ): CancelablePromise<ChartLine> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/chart/account/overview',
            headers: {
                'X-Trace-Id': xTraceId,
            },
            query: {
                'start': start,
                'end': end,
                'period': period,
                'preselected': preselected,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthenticated`,
                404: `Page not found`,
                422: `Validation error. The body will have the exact details.`,
                500: `Internal exception`,
            },
        });
    }
    /**
     * Dashboard chart with balance information.
     * This endpoint returns the data required to generate a chart with balance information.
     *
     * @param start A date formatted YYYY-MM-DD.
     *
     * @param end A date formatted YYYY-MM-DD.
     *
     * @param xTraceId Unique identifier associated with this request.
     * @param period Optional period to group the data by. If not provided, it will default to '1M' or whatever is deemed relevant for the range provided.
     *
     * If you want to know which periods are available, see the enums or get the configuration value: `GET /api/v1/configuration/firefly.valid_view_ranges`
     *
     * @param preselected Optional set of preselected accounts to limit the chart to. This may be easier than submitting all asset accounts manually, for example.
     * If you want to know which selection are available, see the enums here or get the configuration value: `GET /api/v1/configuration/firefly.preselected_accounts`
     *
     * - `empty`: do not do a pre-selection
     * - `all`: select all asset and all liability accounts
     * - `assets`: select all asset accounts
     * - `liabilities`: select all liability accounts
     *
     * If no accounts are found, the user's "frontpage accounts" preference will be used. If that is empty, all asset accounts will be used.
     *
     * @param accountsArray Limit the chart to these asset accounts or liabilities. Only asset accounts and liabilities will be accepted. Other types will be silently dropped.
     *
     * This list of accounts will be OVERRULED by the `preselected` parameter.
     *
     * @returns ChartLine Line chart oriented chart information. Check out the model for more details. Each entry is a line (or bar) in the chart.
     * @throws ApiError
     */
    public static getChartBalance(
        start: string,
        end: string,
        xTraceId?: string,
        period?: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y',
        preselected?: 'empty' | 'all' | 'assets' | 'liabilities',
        accountsArray?: Array<number>,
    ): CancelablePromise<ChartLine> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/chart/balance/balance',
            headers: {
                'X-Trace-Id': xTraceId,
            },
            query: {
                'start': start,
                'end': end,
                'period': period,
                'preselected': preselected,
                'accounts[]': accountsArray,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthenticated`,
                404: `Page not found`,
                422: `Validation error. The body will have the exact details.`,
                500: `Internal exception`,
            },
        });
    }
    /**
     * Dashboard chart with budget information.
     * This endpoint returns the data required to generate a chart with basic budget information.
     *
     * @param start A date formatted YYYY-MM-DD.
     *
     * @param end A date formatted YYYY-MM-DD.
     *
     * @param xTraceId Unique identifier associated with this request.
     * @returns ChartLine Bar chart oriented chart information. Check out the model for more details. Each entry is a line (or bar) in the chart.
     * @throws ApiError
     */
    public static getChartBudgetOverview(
        start: string,
        end: string,
        xTraceId?: string,
    ): CancelablePromise<ChartLine> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/chart/budget/overview',
            headers: {
                'X-Trace-Id': xTraceId,
            },
            query: {
                'start': start,
                'end': end,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthenticated`,
                404: `Page not found`,
                422: `Validation error. The body will have the exact details.`,
                500: `Internal exception`,
            },
        });
    }
    /**
     * Dashboard chart with category information.
     * This endpoint returns the data required to generate a chart with basic category information.
     *
     * @param start A date formatted YYYY-MM-DD.
     *
     * @param end A date formatted YYYY-MM-DD.
     *
     * @param xTraceId Unique identifier associated with this request.
     * @returns ChartLine Line chart oriented chart information. Check out the model for more details. Each entry is a line (or bar) in the chart.
     * @throws ApiError
     */
    public static getChartCategoryOverview(
        start: string,
        end: string,
        xTraceId?: string,
    ): CancelablePromise<ChartLine> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/chart/category/overview',
            headers: {
                'X-Trace-Id': xTraceId,
            },
            query: {
                'start': start,
                'end': end,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthenticated`,
                404: `Page not found`,
                422: `Validation error. The body will have the exact details.`,
                500: `Internal exception`,
            },
        });
    }
}
