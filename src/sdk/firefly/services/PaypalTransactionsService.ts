/* tslint:disable */
/* eslint-disable */
import type { TransactionArray } from '../models/TransactionArray';
import type { TransactionSingle } from '../models/TransactionSingle';
import type { TransactionTypeFilter } from '../models/TransactionTypeFilter';
import type { TransactionUpdate } from '../models/TransactionUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { PaypalOpenAPI } from '../core/PaypalOpenAPI';
import { request as __request } from '../core/request';

/**
 * Transactions service using the PayPal Firefly III account client.
 */
export class PaypalTransactionsService {
    /**
     * List all the user's transactions via the PayPal Firefly III account.
     * @param xTraceId Unique identifier associated with this request.
     * @param limit Number of items per page. The default pagination is per 50 items.
     * @param page Page number. The default pagination is per 50 items.
     * @param start A date formatted YYYY-MM-DD.
     * @param end A date formatted YYYY-MM-DD.
     * @param type Optional filter on the transaction type(s) returned.
     * @returns TransactionArray A list of transactions.
     * @throws ApiError
     */
    public static listTransaction(
        xTraceId?: string,
        limit?: number,
        page?: number,
        start?: string,
        end?: string,
        type?: TransactionTypeFilter,
    ): CancelablePromise<TransactionArray> {
        return __request(PaypalOpenAPI, {
            method: 'GET',
            url: '/v1/transactions',
            headers: {
                'X-Trace-Id': xTraceId,
            },
            query: {
                'limit': limit,
                'page': page,
                'start': start,
                'end': end,
                'type': type,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthenticated`,
                404: `Page not found`,
                500: `Internal exception`,
            },
        });
    }

    /**
     * Update existing transaction via the PayPal Firefly III account.
     * @param id The ID of the transaction.
     * @param requestBody JSON array with updated transaction information.
     * @param xTraceId Unique identifier associated with this request.
     * @returns TransactionSingle Updated transaction stored, result in response.
     * @throws ApiError
     */
    public static updateTransaction(
        id: string,
        requestBody: TransactionUpdate,
        xTraceId?: string,
    ): CancelablePromise<TransactionSingle> {
        return __request(PaypalOpenAPI, {
            method: 'PUT',
            url: '/v1/transactions/{id}',
            path: {
                'id': id,
            },
            headers: {
                'X-Trace-Id': xTraceId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
