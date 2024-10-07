import { getIcrcIndexNgCanister } from '$lib/canisters/icrc.index.canister';
import type { IndexCanisterApiFunctionParams } from '$lib/types/canister';
import { type Identity } from '@dfinity/agent';
import {
	IcrcIndexNgCanister,
	type BalanceParams,
	type GetIndexNgAccountTransactionsParams
} from '@dfinity/ledger-icrc';
import type { GetTransactions, Tokens } from '@dfinity/ledger-icrc/dist/candid/icrc_index-ng';
import { Principal } from '@dfinity/principal';
import { isNullish } from '@dfinity/utils';
import { assertNonNullish, type QueryParams } from '@dfinity/utils';
import { isIdentityNotEqual } from '@utils/identity.utils';

let indexCanister: IcrcIndexNgCanister | undefined = undefined;
let currentIdentity: Identity;

export const getTransactions = async ({
	identity,
	canisterId,
	...params
}: IndexCanisterApiFunctionParams<GetIndexNgAccountTransactionsParams>): Promise<GetTransactions> => {
	const { getTransactions } = await icrcIndexNgCanister({
		identity,
		canisterId
	});

	return getTransactions(params);
};

export const ledgerId = async ({
	identity,
	canisterId,
	...params
}: IndexCanisterApiFunctionParams<QueryParams>): Promise<Principal> => {
	const { ledgerId } = await icrcIndexNgCanister({
		identity,
		canisterId
	});

	return ledgerId(params);
};

export const balance = async ({
	identity,
	canisterId,
	...params
}: IndexCanisterApiFunctionParams<BalanceParams>): Promise<Tokens> => {
	const { balance } = await icrcIndexNgCanister({
		identity,
		canisterId
	});

	return balance(params);
};

const icrcIndexNgCanister = async ({
	identity,
	canisterId,
	nullishIdentityErrorMessage
}: IndexCanisterApiFunctionParams): Promise<IcrcIndexNgCanister> => {
	assertNonNullish(identity, nullishIdentityErrorMessage);

	if (isNullish(indexCanister) || isIdentityNotEqual(currentIdentity, identity)) {
		indexCanister = await getIcrcIndexNgCanister({
			identity,
			canisterId: Principal.fromText(canisterId)
		});

		currentIdentity = identity;
	}

	return indexCanister;
};
