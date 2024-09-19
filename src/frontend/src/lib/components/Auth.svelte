<script lang="ts">
	import { authStore } from '../stores/auth.store';
	import Button from './ui/button/button.svelte';

	$: isAuthenticated = $authStore.isAuthenticated;

	const login = async () => {
		await authStore.signIn();
	};
</script>

{#if isAuthenticated}
	<Button variant="secondary" on:click={() => authStore.signOut()} class="secondary">LOGOUT</Button>
{:else}
	<Button on:click={() => login()}>LOGIN</Button>
{/if}
