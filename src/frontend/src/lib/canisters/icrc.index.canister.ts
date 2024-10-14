import { getAgent } from '$lib/actors/agents.ic';
import type { Identity } from '@dfinity/agent';
import { IcrcIndexNgCanister } from '@dfinity/ledger-icrc';
import type { Principal } from '@dfinity/principal';

export const getIcrcIndexNgCanister = async ({
	canisterId,
	identity
}: {
	canisterId: Principal;
	identity: Identity;
}): Promise<IcrcIndexNgCanister> => {
	const agent = await getAgent({ identity });

	return IcrcIndexNgCanister.create({
		agent,
		canisterId: canisterId
	});
};
