<script lang="ts">
	import { Input } from '@components/ui/input/index.js';
	import { Label } from '@components/ui/label/index.js';
	import ButtonWithSpinner from '../ButtonWithSpinner.svelte';
	import { addNewUser } from '@services/user.service';
	import { i18n } from '@stores/i18n.store';
	import { validateEmail } from '@utils/email.utils';

	let name = '';
	let email = '';
	let buttonDisable = false;

	let enableNameError = false;
	let enableEmailError = false;

	function handleInputs() {
		enableNameError = name.length < 2;

		enableEmailError = email.length > 0 && !validateEmail(email);

		buttonDisable = enableNameError || enableEmailError;
	}

	async function addUser() {
		handleInputs();

		if (buttonDisable || name.length < 2) return;

		let { success } = await addNewUser({ name, email: email.length > 0 ? email : undefined });
		complete = success;
	}
	export let complete = false;
</script>

<div class="flex flex-col items-center">
	<div class="m-6 w-full max-w-md p-4">
		<Label for="name" class="mb-2 block">{$i18n.userdata.text.name}<span>*</span></Label>
		<Input
			id="name"
			type="text"
			placeholder={$i18n.userdata.placeholder.name}
			bind:value={name}
			on:input={handleInputs}
		/>
		{#if enableNameError}
			<p class="mt-1 text-sm text-muted-foreground">{$i18n.userdata.assertion.name_required}</p>
		{/if}
		<Label for="email" class="mb-2 mt-4 block">{$i18n.userdata.text.email}</Label>
		<Input
			id="email"
			type="email"
			placeholder={$i18n.userdata.placeholder.email}
			bind:value={email}
			on:input={handleInputs}
		/>
		{#if enableEmailError}
			<p class="mt-1 text-sm text-muted-foreground">{$i18n.userdata.assertion.email_invalid}</p>
		{/if}

		<ButtonWithSpinner class="mt-6 w-24" disabled={buttonDisable} onClick={addUser}>
			{$i18n.userdata.text.continue}
		</ButtonWithSpinner>
	</div>
</div>
