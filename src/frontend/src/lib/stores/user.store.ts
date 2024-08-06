import { writable } from 'svelte/store';
import type { UserData } from '../../../../declarations/backend/backend.did';
import { getUserData } from '$lib/api';
import { alerterStore } from './alerter.store';
import { goto } from '$app/navigation';

type UserStoreData = {
	isRegistered: boolean;
	userData: UserData;
};

export const userStore = writable<UserStoreData>({
	isRegistered: false,
	userData: {
		owned_principals: [],
		name: '',
		email: [],
		known_principals: []
	}
});

export async function userSyncAndNavigation() {
	try {
		const result = await getUserData();
		if ('Ok' in result) {
			userStore.set({ isRegistered: true, userData: result.Ok });
			goto('/');
		} else {
			goto('/register/');
		}
	} catch (error) {
		console.error(error);
		alerterStore.show({ level: 'error', message: "Can't Communicate with Backend." });
	}
}

export async function userSync() {
	try {
		const result = await getUserData();
		if ('Ok' in result) {
			userStore.set({ isRegistered: true, userData: result.Ok });
		} else {
			userStore.set({
				isRegistered: false,
				userData: {
					owned_principals: [],
					name: '',
					email: [],
					known_principals: []
				}
			});
		}
	} catch (error) {
		console.error(error);
		userStore.set({
			isRegistered: false,
			userData: {
				owned_principals: [],
				name: '',
				email: [],
				known_principals: []
			}
		});
	}
}
