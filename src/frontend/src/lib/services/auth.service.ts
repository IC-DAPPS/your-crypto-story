import { authStore, type AuthSignInParams } from '@stores/auth.store';
import { toast } from 'svelte-sonner';

export const signIn = async (params: AuthSignInParams) => {
	let toastId = toast.loading('Authenticating...');
	try {
		await authStore.signIn(params);

		toast.success('Authentication successful', {
			id: toastId
		});
	} catch (err: unknown) {
		if (err === 'UserInterrupt') {
			toast.error('Authentication canceled', {
				id: toastId
			});
		}
		console.error(err);
		toast.error('Authentication failed', {
			id: toastId
		});
	}
};

export const signOut = async () => {
	await authStore.signOut();
	toast.success('Logged out');
};
