import type { Agent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { IcrcIndexNgCanister, IcrcLedgerCanister } from '@dfinity/ledger-icrc';
import { createAgent } from '@dfinity/utils';
import { get } from 'svelte/store';
import { authStore } from './stores/auth.store';

const getAgent = async (identity: Identity): Promise<Agent> => {
	return await createAgent({
		identity,
		host: 'https://ic0.app' //import.meta.env.VITE_HOST
	});
};

export const getIcrcIndexActor = async (
	identity: Identity,
	canisterId: string
): Promise<IcrcIndexNgCanister> => {
	return IcrcIndexNgCanister.create({
		agent: await getAgent(identity),
		canisterId: Principal.fromText(canisterId)
	});
};

export const getIcrcIndexCanister = async (canisterId: string): Promise<IcrcIndexNgCanister> => {
	return await getIcrcIndexActor(get(authStore).identity, canisterId);
};

export const getIcrcLedgerCanister = async (canisterId: Principal): Promise<IcrcLedgerCanister> => {
	return IcrcLedgerCanister.create({
		agent: await getAgent(get(authStore).identity),
		canisterId
	});
};
