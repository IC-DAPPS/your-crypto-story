<script lang="ts">
	import Label from 'flowbite-svelte/Label.svelte';
	import Input from 'flowbite-svelte/Input.svelte';
	import Button from 'flowbite-svelte/Button.svelte';
	import EnvelopeSolid from 'flowbite-svelte-icons/EnvelopeSolid.svelte';
	import Helper from 'flowbite-svelte/Helper.svelte';
	import { authStore } from '$lib/stores/auth.store';
	import Spinner from 'flowbite-svelte/Spinner.svelte';
	import { alerterStore } from '$lib/stores/alerter.store';

	let name = '';
	let email = '';
	let buttonDisable = false;

	let enableNameError = false;
	let enableEmailError = false;

	let spinner = false;

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
			spinner = true;
			let result = await $authStore.actor.insert_userdata(name, email.length > 0 ? [email] : []);
			spinner = false;
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

<div class="flex items-center flex-col">
	<div class="m-6 max-w-md w-full p-4">
		<Label for="default-input" class="block mb-2">Your Name <span>*</span></Label>
		<Input
			id="name"
			type="text"
			placeholder="Name"
			color={enableNameError ? 'red' : 'base'}
			bind:value={name}
			on:input={handleInputs}
		/>
		{#if enableNameError}
			<Helper class="mt-2" color="red">Required field. Minimum two characters.</Helper>
		{/if}
		<Label for="input-group-1" class="block mb-2 mt-4">Your Email</Label>
		<Input
			id="email"
			type="email"
			placeholder="name@flowbite.com"
			color={enableEmailError ? 'red' : 'base'}
			bind:value={email}
			on:input={handleInputs}
		>
			<EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
		</Input>
		{#if enableEmailError}
			<Helper class="mt-2" color="red">Input valid email.</Helper>
		{/if}

		<Button
			class={spinner ? 'mt-6 animate-pulse' : 'mt-6'}
			color={spinner ? 'dark' : 'primary'}
			disabled={buttonDisable || spinner}
			on:click={addUser}
		>
			{#if spinner}
				<Spinner class="me-3 dark:text-white" size="4" />
			{/if}
			Continue</Button
		>
	</div>
</div>
