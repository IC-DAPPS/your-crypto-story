import type { Agent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { IcrcIndexNgCanister, IcrcLedgerCanister } from '@dfinity/ledger-icrc';
import { createAgent } from '@dfinity/utils';
import { get } from 'svelte/store';
import { authStore } from './stores/auth.store';
import { onDestroy } from 'svelte';

const getAgent = async (identity: Identity): Promise<Agent> => {
	return await createAgent({
		identity,
		host: 'https://ic0.app' //import.meta.env.VITE_HOST
	});
};

let agent = await getAgent(get(authStore).identity);

const unsubcrine = authStore.subscribe(async (value) => {
	agent = await getAgent(value.identity);
});
onDestroy(unsubcrine);

export const getIcrcIndexCanister = (canisterId: string): IcrcIndexNgCanister => {
	return IcrcIndexNgCanister.create({
		agent,
		canisterId: Principal.fromText(canisterId)
	});
};

export const getIcrcLedgerCanister = (canisterId: Principal): IcrcLedgerCanister => {
	return IcrcLedgerCanister.create({
		agent,
		canisterId
	});
};
