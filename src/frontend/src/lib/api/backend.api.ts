import { BackendCanister } from '$lib/canisters/backend.canister';
import type {
	InsertUserDataParams,
	UpdatePrincipalNameParams,
	DeletePrincipalResponse,
	GetUserDataResponse,
	InsertPrincipalsResponse,
	InsertUserDataResponse,
	UpdatePrincipalNameResponse
} from '$lib/types/api';
import type { CommonCanisterApiFunctionParams } from '$lib/types/canister';
import { BACKEND_CANISTER_ID } from '@constants/app.constants';
import type { PrincipalName } from '@declarations/backend/backend.did';
import { Principal } from '@dfinity/principal';

import { assertNonNullish, isNullish, type QueryParams } from '@dfinity/utils';

let canister: BackendCanister | undefined = undefined;

export const deleteKnownPrincipal = async ({
	identity,
	index
}: CommonCanisterApiFunctionParams<{
	index: bigint;
}>): Promise<DeletePrincipalResponse> => {
	const { deleteKnownPrincipal } = await backendCanister({ identity });

	return deleteKnownPrincipal({ index });
};

export const deleteOwnedPrincipal = async ({
	identity,
	index
}: CommonCanisterApiFunctionParams<{
	index: bigint;
}>): Promise<DeletePrincipalResponse> => {
	const { deleteOwnedPrincipal } = await backendCanister({ identity });

	return deleteOwnedPrincipal({ index });
};

export const getUserdata = async ({
	identity,
	certified = true
}: CommonCanisterApiFunctionParams<QueryParams>): Promise<GetUserDataResponse> => {
	const { getUserdata } = await backendCanister({ identity });

	return getUserdata({ certified });
};

export const insertKnownPrincipals = async ({
	identity,
	principalsAndNames
}: CommonCanisterApiFunctionParams<{
	principalsAndNames: Array<PrincipalName>;
}>): Promise<InsertPrincipalsResponse> => {
	const { insertKnownPrincipals } = await backendCanister({ identity });

	return insertKnownPrincipals(principalsAndNames);
};

export const insertOwnedPrincipals = async ({
	identity,
	principalsAndNames
}: CommonCanisterApiFunctionParams<{
	principalsAndNames: Array<PrincipalName>;
}>): Promise<InsertPrincipalsResponse> => {
	const { insertOwnedPrincipals } = await backendCanister({ identity });

	return insertOwnedPrincipals(principalsAndNames);
};

export const insertUserdata = async ({
	identity,
	...params
}: CommonCanisterApiFunctionParams<InsertUserDataParams>): Promise<InsertUserDataResponse> => {
	const { insertUserdata } = await backendCanister({ identity });

	return insertUserdata(params);
};

export const updateKnownPrincipalName = async ({
	identity,
	...params
}: CommonCanisterApiFunctionParams<UpdatePrincipalNameParams>): Promise<UpdatePrincipalNameResponse> => {
	const { updateKnownPrincipalName } = await backendCanister({ identity });

	return updateKnownPrincipalName(params);
};

export const updateOwnedPrincipalName = async ({
	identity,
	...params
}: CommonCanisterApiFunctionParams<UpdatePrincipalNameParams>): Promise<UpdatePrincipalNameResponse> => {
	const { updateOwnedPrincipalName } = await backendCanister({ identity });

	return updateOwnedPrincipalName(params);
};

const backendCanister = async ({
	identity,
	nullishIdentityErrorMessage,
	canisterId = BACKEND_CANISTER_ID
}: CommonCanisterApiFunctionParams): Promise<BackendCanister> => {
	assertNonNullish(identity, nullishIdentityErrorMessage);

	if (isNullish(canister)) {
		canister = await BackendCanister.create({
			identity,
			canisterId: Principal.fromText(canisterId)
		});
	}

	return canister;
};
