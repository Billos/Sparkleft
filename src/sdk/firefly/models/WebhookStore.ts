/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WebhookDeliveryArray } from './WebhookDeliveryArray';
import type { WebhookResponseArray } from './WebhookResponseArray';
import type { WebhookTriggerArray } from './WebhookTriggerArray';
export type WebhookStore = {
    /**
     * Boolean to indicate if the webhook is active
     */
    active?: boolean;
    /**
     * A title for the webhook for easy recognition.
     */
    title: string;
    triggers?: WebhookTriggerArray;
    responses?: WebhookResponseArray;
    deliveries?: WebhookDeliveryArray;
    /**
     * The URL of the webhook. Has to start with `https`.
     */
    url: string;
};

