import type { PrincipalNameInput, PrincipalNameMap } from '$lib/types/principal-name';
import type { PrincipalName, UserData } from '@declarations/backend/backend.did';
import { userStore } from '@stores/user.store';
import { get } from 'svelte/store';
import { Principal } from '@dfinity/principal';
import { toast } from 'svelte-sonner';
import { i18n } from '@stores/i18n.store';

function createPrincipalNameMap(userData: UserData): PrincipalNameMap {
	const principalNameMap = new Map<string, string>();
	const seenPrincipals = new Set<string>();

	// Pre-allocate for owned_principals
	userData.owned_principals.forEach(({ principal, name }) => {
		const principalText = principal.toText();
		if (!seenPrincipals.has(principalText)) {
			principalNameMap.set(principalText, name);
			seenPrincipals.add(principalText);
		}
	});

	// Add known_principals if not already present
	userData.known_principals.forEach(({ principal, name }) => {
		const principalText = principal.toText();
		if (!seenPrincipals.has(principalText)) {
			principalNameMap.set(principalText, name);
			seenPrincipals.add(principalText);
		}
	});

	return principalNameMap;
}

export const getPrincipalNameMap = (): PrincipalNameMap => {
	return createPrincipalNameMap(get(userStore).userData);
};

export const inputsToPrincipalsAndNames = (inputs: PrincipalNameInput[]): PrincipalName[] => {
	return inputs.reduce<PrincipalName[]>((accumulator, { principal, name }) => {
		try {
			accumulator.push({
				principal: Principal.fromText(principal),
				name
			});
		} catch (error) {
			console.error(error);
			toast.error(principal + get(i18n).userdata.error.principal_conversion_error);
		}
		return accumulator;
	}, []);
};
