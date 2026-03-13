/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RuleTriggerKeyword } from './RuleTriggerKeyword';
export type RuleTriggerUpdate = {
    type?: RuleTriggerKeyword;
    /**
     * The accompanying value the trigger responds to. This value is often mandatory, but this depends on the trigger. If the rule trigger is something like 'has any tag', submit the string 'true'.
     */
    value?: string;
    /**
     * Order of the trigger
     */
    order?: number;
    /**
     * If the trigger is active.
     */
    active?: boolean;
    /**
     * When true, other triggers will not be checked if this trigger was triggered.
     */
    stop_processing?: boolean;
};

