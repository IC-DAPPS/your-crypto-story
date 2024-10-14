import type { AuthClient } from '@dfinity/auth-client';
import type { OptionIdentity } from '$lib/types/identity';
import type { Option } from '$lib/types/utils';
import { createAuthClient } from '@utils/auth.utils';
import { writable, type Readable } from 'svelte/store';
import {
	Network,
	INTERNET_IDENTITY_CANISTER_ID,
	AUTH_MAX_TIME_TO_LIVE,
	AUTH_POPUP_WIDTH,
	AUTH_POPUP_HEIGHT
} from '@constants/app.constants';
import { popupCenter } from '@utils/window.utils';

export interface AuthStoreData {
	identity: OptionIdentity;
}

let authClient: Option<AuthClient>;

export interface AuthSignInParams {
	domain?: 'ic0.app' | 'internetcomputer.org';
}

export interface AuthStore extends Readable<AuthStoreData> {
	sync: () => Promise<void>;
	signIn: (params: AuthSignInParams) => Promise<void>;
	signOut: () => Promise<void>;
}

const initAuthStore = (): AuthStore => {
	const { set, subscribe, update } = writable<AuthStoreData>({
		identity: undefined
	});

	return {
		subscribe,
		sync: async () => {
			authClient = authClient ?? (await createAuthClient());

			const isAuthenticated = await authClient.isAuthenticated();

			set({ identity: isAuthenticated ? authClient.getIdentity() : null });
		},

		signIn: ({ domain }: AuthSignInParams) =>
			new Promise(async (resolve, reject) => {
				authClient = authClient ?? (await createAuthClient());

				const identityProvider =
					Network === 'local'
						? /apple/i.test(navigator?.vendor)
							? `http://localhost:8080?canisterId=${INTERNET_IDENTITY_CANISTER_ID}`
							: `http://${INTERNET_IDENTITY_CANISTER_ID}.localhost:8080`
						: `https://identity.${domain ?? 'ic0.app'}`;

				await authClient.login({
					maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
					onSuccess: () => {
						update((state: AuthStoreData) => ({
							...state,
							identity: authClient?.getIdentity()
						}));

						resolve();
					},
					onError: reject,
					identityProvider,
					windowOpenerFeatures: popupCenter({
						width: AUTH_POPUP_WIDTH,
						height: AUTH_POPUP_HEIGHT
					})
				});
			}),
		signOut: async () => {
			const client: AuthClient = authClient ?? (await createAuthClient());
			await client.logout();

			// This fix a "sign in -> sign out -> sign in again" flow without window reload.
			authClient = null;

			update((state: AuthStoreData) => ({
				...state,
				identity: null
			}));
		}
	};
};

export const authStore = initAuthStore();
