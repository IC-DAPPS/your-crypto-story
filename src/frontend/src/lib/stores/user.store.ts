import { get, writable, type Readable } from 'svelte/store';
import type { GetUserDataError, UserData } from '@declarations/backend/backend.did';
import { getUserdata } from '$lib/api/backend.api';
import { authStore } from './auth.store';
import { toast } from 'svelte-sonner';
import { i18n } from './i18n.store';
import { goto } from '$app/navigation';

type UserStoreData = {
	isRegistered: boolean;
	userData: UserData;
};

export interface UserStore extends Readable<UserStoreData> {
	sync: () => Promise<void>;
}

const initUserStore = (): UserStore => {
	const { set, subscribe } = writable<UserStoreData>({
		isRegistered: false,
		userData: {
			owned_principals: [],
			name: '',
			email: [],
			known_principals: []
		}
	});
	return {
		subscribe,
		sync: async () => {
			try {
				const response = await getUserdata({
					identity: get(authStore).identity
				});
				if ('Ok' in response) {
					set({ isRegistered: true, userData: response.Ok });
				} else if ('Err' in response) {
					handleGetUserDataError(response.Err);
				}
			} catch (error) {
				console.error(error);
				toast.error(get(i18n).userdata.error.fetch);
			}
		}
	};
};

const handleGetUserDataError = (err: GetUserDataError) => {
	if ('DidntFindUserData' in err) {
		goto('/register/');
		toast.info(get(i18n).userdata.error.no_userdata_found);
	} else if ('AnonymousCaller' in err) {
		toast.info(get(i18n).userdata.error.anonymous_user);
	}
};

export const userStore = initUserStore();
