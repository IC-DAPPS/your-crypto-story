<script>
	import NavBar from '@components/NavBar.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { authStore } from '@stores/auth.store';
	import { Toaster } from "$lib/components/ui/sonner";

	onMount(async () => {
		await authStore.sync();
	});
</script>

<ModeWatcher />
<NavBar />
<Toaster />
<slot></slot>

<style lang="postcss" global>
</style>
