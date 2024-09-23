<script>
	import KnownPrincipalForm from '@components/register/KnownPrincipalForm.svelte';
	import NameEmailForm from '@components/register/NameEmailForm.svelte';
	import OwnedPrincipalForm from '@components/register/OwnedPrincipalForm.svelte';
	import Alerter from '$lib/components/Alerter.svelte';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { userSync } from '$lib/stores/user.store';

	let nameEmailFormComplete = false;
	let ownedPrincipalFormComplete = false;
	let knownPrincipalFormComplete = false;

	async function handleKnownPrincipalFormComplete() {
		await userSync();
		goto('/');
	}
</script>

<Alerter />
<div in:fly={{ x: '-100%', duration: 500 }}>
	<h2
		class="text-primary-900 font-display mx-6 mb-2 mt-6 text-center text-3xl leading-relaxed tracking-wide dark:text-sky-100 max-md:text-2xl"
		in:fly={{ y: '-100vh', duration: 500 }}
		out:fly={{ y: '-40', duration: 500 }}
	>
		Welcome! Let's set this up.
	</h2>
	{#if !nameEmailFormComplete}
		<div in:fly={{ x: '-100%', duration: 500 }} out:fly={{ x: '100%', duration: 400 }}>
			<NameEmailForm bind:complete={nameEmailFormComplete} />
		</div>
	{:else if nameEmailFormComplete && !ownedPrincipalFormComplete}
		<div>
			<OwnedPrincipalForm bind:complete={ownedPrincipalFormComplete} />
		</div>
	{:else if ownedPrincipalFormComplete}
		<KnownPrincipalForm
			bind:complete={knownPrincipalFormComplete}
			on:complete={handleKnownPrincipalFormComplete}
		/>
	{/if}
</div>
