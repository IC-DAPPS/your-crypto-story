import { getAgent } from '$lib/actors/agents.ic';
import type { InsertUserDataParams, UpdatePrincipalNameParams } from '$lib/types/api';
import type { CreateCanisterOptions } from '$lib/types/canister';
import { idlFactory as idlFactoryBackend } from '@declarations/backend';
import {
	type PrincipalName,
	type _SERVICE as BackendService,
	type Result,
	type Result_1,
	type Result_2
} from '@declarations/backend/backend.did.d';
import { Canister, createServices, type QueryParams } from '@dfinity/utils';

export class BackendCanister extends Canister<BackendService> {
	static async create({ identity, ...options }: CreateCanisterOptions<BackendService>) {
		const agent = await getAgent({ identity });

		const { service, certifiedService, canisterId } = createServices<BackendService>({
			options: { agent, ...options },
			idlFactory: idlFactoryBackend,
			certifiedIdlFactory: idlFactoryBackend
		});

		return new BackendCanister(canisterId, service, certifiedService);
	}

	deleteKnownPrincipal = async ({ index }: { index: bigint }): Promise<Result> => {
		const { delete_known_principal } = this.caller({ certified: true });

		return delete_known_principal(index);
	};

	deleteOwnedPrincipal = async ({ index }: { index: bigint }): Promise<Result> => {
		const { delete_owned_principal } = this.caller({ certified: true });

		return delete_owned_principal(index);
	};

	getUserdata = async ({ certified }: QueryParams): Promise<Result_1> => {
		const { get_userdata } = this.caller({ certified });

		return get_userdata();
	};

	insertKnownPrincipals = async (principalsAndNames: Array<PrincipalName>): Promise<Result_2> => {
		const { insert_known_principals } = this.caller({ certified: true });

		return insert_known_principals(principalsAndNames);
	};

	insertOwnedPrincipals = async (principalsAndNames: Array<PrincipalName>): Promise<Result_2> => {
		const { insert_owned_principals } = this.caller({ certified: true });

		return insert_owned_principals(principalsAndNames);
	};

	insertUserdata = async ({ name, email }: InsertUserDataParams): Promise<Result_2> => {
		const { insert_userdata } = this.caller({ certified: true });

		return insert_userdata(name, email);
	};

	updateKnownPrincipalName = async ({
		name,
		index
	}: UpdatePrincipalNameParams): Promise<Result> => {
		const { update_known_principal_name } = this.caller({ certified: true });

		return update_known_principal_name(name, index);
	};

	updateOwnedPrincipalName = async ({
		name,
		index
	}: UpdatePrincipalNameParams): Promise<Result> => {
		const { update_owned_principal_name } = this.caller({ certified: true });

		return update_owned_principal_name(name, index);
	};
}
