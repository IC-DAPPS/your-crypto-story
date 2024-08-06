import { get } from 'svelte/store';
import type { Result_1 } from '../../../declarations/backend/backend.did';
import { authStore } from './stores/auth.store';

export const getUserData = async (): Promise<Result_1> => {
	const actor = get(authStore).actor;
	return actor.get_userdata();
};
