import type { PrincipalNameMap } from '$lib/types/principal-name';
import type { UserData } from '@declarations/backend/backend.did';
import { userStore } from '@stores/user.store';
import { get } from 'svelte/store';

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
