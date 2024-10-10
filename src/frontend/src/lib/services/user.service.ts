import { insertOwnedPrincipals, insertUserdata } from '$lib/api/backend.api';
import type { ResultSuccess } from '$lib/types/utils';
import type { PrincipalName } from '@declarations/backend/backend.did';
import { authStore } from '@stores/auth.store';
import { i18n } from '@stores/i18n.store';
import { toast } from 'svelte-sonner';
import { get } from 'svelte/store';

export const addNewUser = async ({
	name,
	email
}: {
	name: string;
	email?: string;
}): Promise<ResultSuccess> => {
	try {
		const { identity } = get(authStore);
		const response = await insertUserdata({
			identity,
			name,
			email: email ? [email] : []
		});

		if ('Ok' in response) return { success: true };

		const err = response.Err;
		if ('AnonymousCaller' in err) {
			toast.info(get(i18n).userdata.error.anonymous_user);
		}

		return { success: false };
	} catch (error) {
		console.error(error);
		toast.error(get(i18n).userdata.error.error);

		return { success: false };
	}
};

export const addingOwnedPrincipals = async (
	principalsAndNames: Array<PrincipalName>
): Promise<ResultSuccess> => {
	try {
		const { identity } = get(authStore);

		const response = await insertOwnedPrincipals({
			identity,
			principalsAndNames
		});

		if ('Ok' in response) return { success: true };

		const err = response.Err;
		if ('AnonymousCaller' in err) {
			toast.info(get(i18n).userdata.error.anonymous_user);
		} else if ('DidntFindUserData' in err) {
			toast.info(get(i18n).userdata.error.no_userdata_found);
		}

		return { success: false };
	} catch (error) {
		console.error(error);
		toast.error(get(i18n).userdata.error.error);

		return { success: false };
	}
};
