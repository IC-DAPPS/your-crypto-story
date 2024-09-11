<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import NavBar from '$lib/components/NavBar.svelte';
	import { transactionStore } from '$lib/stores/transactions.store';
	import { onDestroy } from 'svelte';
	import { userStore } from '$lib/stores/user.store';
	import { ledgerMetadataStore } from '$lib/stores/ledgerMetadata.store';
	import { authStore } from '$lib/stores/auth.store';

	const unsubscribe1 = authStore.subscribe((value) => {
		console.log('subscribe authStore', value);
	});
	onDestroy(unsubscribe1);

	const unsubscribe2 = userStore.subscribe(async (value) => {
		console.log('subscribe userStore', value);
		console.log('subscribe userStore - owned principals', value.userData.owned_principals);
		if (value.isRegistered) {
			await transactionStore.sync();
		}
	});
	onDestroy(unsubscribe2);

	const unsubscribe3 = ledgerMetadataStore.subscribe((value) => {
		console.log('subscribe ledgerMetadataStore', value);
	});
	onDestroy(unsubscribe3);

	const unsubscribe4 = transactionStore.subscribe((value) => {
		console.log('subscribe transactionStore', value);
	});
	onDestroy(unsubscribe4);
</script>

<ModeWatcher />
<NavBar />
<slot />

<style lang="postcss" global>
</style>
