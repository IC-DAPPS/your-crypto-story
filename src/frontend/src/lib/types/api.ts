import type { UserData, GetUserDataError, DeleteError } from '@declarations/backend/backend.did';

export interface InsertUserDataParams {
	name: string;
	email: [] | [string];
}

export interface UpdatePrincipalNameParams {
	name: string;
	index: bigint;
}

export type GetUserDataResponse = { Ok: UserData } | { Err: GetUserDataError };

export type DeletePrincipalResponse = { Ok: null } | { Err: DeleteError };

export type InsertPrincipalsResponse = { Ok: null } | { Err: GetUserDataError };

export type InsertUserDataResponse = { Ok: null } | { Err: GetUserDataError };

export type UpdatePrincipalNameResponse = { Ok: null } | { Err: DeleteError };
