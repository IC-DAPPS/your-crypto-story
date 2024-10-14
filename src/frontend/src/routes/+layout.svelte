<script>
	import NavBar from '@components/NavBar.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { authStore } from '@stores/auth.store';
	import { Toaster } from '$lib/components/ui/sonner';
	import { i18n } from '@stores/i18n.store';
	import { userStore } from '@stores/user.store';
	import { transactionStore } from '@stores/transactions.store';

	onMount(async () => {
		await authStore.sync();
		await i18n.init();
	});

	authStore.subscribe(async ({ identity }) => {
		if (identity) await userStore.sync();
	});
	userStore.subscribe(async ({ isRegistered }) => {
		if (isRegistered) await transactionStore.sync();

		console.log('transactions store', $transactionStore);
	});
</script>

<ModeWatcher />
<NavBar />
<Toaster />
<slot></slot>

<style lang="postcss" global>
</style>
