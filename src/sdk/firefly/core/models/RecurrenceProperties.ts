/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecurrenceRepetition } from './RecurrenceRepetition';
import type { RecurrenceTransaction } from './RecurrenceTransaction';
import type { RecurrenceTransactionType } from './RecurrenceTransactionType';
export type RecurrenceProperties = {
    readonly created_at?: string;
    readonly updated_at?: string;
    type?: RecurrenceTransactionType;
    title?: string;
    /**
     * Not to be confused with the description of the actual transaction(s) being created.
     */
    description?: string;
    /**
     * First time the recurring transaction will fire. Must be after today.
     */
    first_date?: string;
    /**
     * Last time the recurring transaction has fired.
     */
    readonly latest_date?: string | null;
    /**
     * Date until the recurring transaction can fire. Use either this field or repetitions.
     */
    repeat_until?: string | null;
    /**
     * Whether or not to fire the rules after the creation of a transaction.
     */
    apply_rules?: boolean;
    /**
     * If the recurrence is even active.
     */
    active?: boolean;
    /**
     * Max number of created transactions. Use either this field or repeat_until.
     */
    nr_of_repetitions?: number | null;
    notes?: string | null;
    repetitions?: Array<RecurrenceRepetition>;
    transactions?: Array<RecurrenceTransaction>;
};

