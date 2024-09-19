<script lang="ts">
	import { authStore } from '$lib/stores/auth.store';
	import { alerterStore } from '$lib/stores/alerter.store';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import ButtonWithSpinner from './ButtonWithSpinner.svelte';

	let name = '';
	let email = '';
	let buttonDisable = false;

	let enableNameError = false;
	let enableEmailError = false;

	function validateEmail(email: string): boolean {
		// Regular expression for basic email validation
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	function handleInputs() {
		enableNameError = name.length < 2;
		enableEmailError = email.length > 0 && !validateEmail(email);
		buttonDisable = enableNameError || enableEmailError;
	}

	async function addUser() {
		handleInputs();

		if (buttonDisable || name.length < 2) return;

		try {
			let result = await $authStore.actor.insert_userdata(name, email.length > 0 ? [email] : []);

			if ('Err' in result) {
				if ('AnonymousCaller' in result.Err) {
					alerterStore.show({ level: 'error', message: 'Anonymous user, please Log in.' });
				}
			} else {
				complete = true;
			}
		} catch (error) {
			alerterStore.show({ level: 'error', message: 'Backend communication issues.' });
			console.error(error);
		}
	}
	export let complete = false;
</script>

<div class="flex flex-col items-center">
	<div class="m-6 w-full max-w-md p-4">
		<Label for="name" class="mb-2 block">Your Name <span>*</span></Label>
		<Input id="name" type="text" placeholder="Name" bind:value={name} on:input={handleInputs} />
		{#if enableNameError}
			<p class="mt-1 text-sm text-muted-foreground">Required field. Minimum two characters.</p>
		{/if}
		<Label for="email" class="mb-2 mt-4 block">Your Email</Label>
		<Input id="email" type="email" placeholder="Email" bind:value={email} on:input={handleInputs} />
		{#if enableEmailError}
			<p class="mt-1 text-sm text-muted-foreground">Input valid email.</p>
		{/if}

		<ButtonWithSpinner class="mt-6 w-24" disabled={buttonDisable} onClick={addUser}>
			Continue
		</ButtonWithSpinner>
	</div>
</div>
