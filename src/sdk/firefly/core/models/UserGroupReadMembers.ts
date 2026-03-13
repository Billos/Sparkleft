/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserGroupReadRole } from './UserGroupReadRole';
export type UserGroupReadMembers = {
    /**
     * The ID of the member.
     */
    readonly user_id?: string;
    /**
     * The email address of the member
     */
    readonly user_email?: string;
    /**
     * Is this you? (the current user)
     */
    readonly you?: boolean;
    roles?: Array<UserGroupReadRole>;
};

