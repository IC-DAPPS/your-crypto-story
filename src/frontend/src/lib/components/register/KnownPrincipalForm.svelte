<script lang="ts">
	import { Input } from '@components/ui/input/index.js';
	import { Label } from '@components/ui/label/index.js';
	import { Button } from '@components/ui/button/index.js';
	import { createEventDispatcher } from 'svelte';
	import { fly, fade, slide } from 'svelte/transition';
	import type { PrincipalName } from '@declarations/backend/backend.did';
	import type { PrincipalNameInput } from '$lib/types/principal-name';
	import { CircleX } from 'lucide-svelte';
	import ButtonWithSpinner from '../ButtonWithSpinner.svelte';
	import { smoothFly } from '@utils/transition.utils';
	import {
		handleInputs,
		shouldShowPrincipalAliasError,
		shouldShowPrincipalError,
		getPrincipalAliasErrorMessage,
		getPrincipalErrorMessage,
		addNewPrincipalNameForm,
		deleteValue,
		getButtonState
	} from '@utils/principal-form.utils';
	import { inputsToPrincipalsAndNames } from '@utils/principal-name.utils';
	import { addingKnownPrincipals } from '@services/user.service';
	import { i18n } from '@stores/i18n.store';

	const dispatch = createEventDispatcher();

	let groupOfValue: PrincipalNameInput[] = [];

	let buttonDisabled = false;

	let disabledSkip = false;

	export let complete = false;

	async function addKnownPrincipals() {
		disabledSkip = true;
		buttonDisabled = getButtonState(groupOfValue);

		const knownPrincipals: PrincipalName[] = inputsToPrincipalsAndNames(groupOfValue);

		if (knownPrincipals.length === 0) {
			skipStep();
			return;
		}

		const { success } = await addingKnownPrincipals(knownPrincipals);
		complete = success;
		disabledSkip = false;
		if (success) {
			groupOfValue = [];
			dispatch('complete', { skipped: false });
		}
	}

	function skipStep() {
		complete = true;
		dispatch('complete', { skipped: true });
	}

	function handleAddNewForm() {
		const { newGroupOfInputs, newButtonState } = addNewPrincipalNameForm(groupOfValue);
		groupOfValue = newGroupOfInputs;
		buttonDisabled = newButtonState;
	}

	function handleDeleteValue(index: number) {
		const { newGroupOfInputs, newButtonState } = deleteValue(index, groupOfValue);
		groupOfValue = newGroupOfInputs;
		buttonDisabled = newButtonState;
	}
</script>

<div
	class="mt-2 flex flex-col items-center"
	in:fly={{ x: '-100%', duration: 500, delay: 380 }}
	out:fly={{ x: '100%', duration: 400 }}
>
	<div class="w-full max-w-xl">
		<p class="mb-2 text-start text-sm font-medium max-sm:px-3">
			{$i18n.userdata.text.add_known_principal_description}
		</p>
	</div>
	<hr />
	<div class="flex w-full max-w-xl justify-between max-sm:px-3">
		<Button variant="outline" on:click={handleAddNewForm}>
			{$i18n.userdata.text.add_new_form}
		</Button>
		<div class="flex">
			<ButtonWithSpinner class="w-24" disabled={buttonDisabled} onClick={addKnownPrincipals}>
				{$i18n.userdata.text.submit}
			</ButtonWithSpinner>
			<Button class="ml-2 w-24" variant="secondary" disabled={disabledSkip} on:click={skipStep}>
				{$i18n.userdata.text.skip}
			</Button>
		</div>
	</div>
	{#each groupOfValue as value, index (index)}
		<div
			id="value-div"
			class="m-6 w-full max-w-xl rounded border p-3"
			in:smoothFly={{ delay: index * 100, duration: 300, y: 30 }}
			out:fade={{ duration: 300 }}
		>
			<div class="mb-2 flex justify-between">
				<Label for="principal-input-{index}" class="block"
					>{$i18n.userdata.text.principal} <span class="text-red-500">*</span>
				</Label>

				<button
					on:click={() => handleDeleteValue(index)}
					transition:slide|local={{ duration: 200 }}
				>
					<CircleX />
				</button>
			</div>
			<Input
				type="text"
				id="principal-input-{index}"
				placeholder={$i18n.userdata.placeholder.principal}
				bind:value={value.principal}
				on:input={() => (buttonDisabled = handleInputs('principal', value, groupOfValue))}
				on:blur={() => (buttonDisabled = handleInputs('principal', value, groupOfValue))}
			/>
			{#if shouldShowPrincipalError(value, index, groupOfValue)}
				<p class="mt-2 text-sm text-muted-foreground" transition:slide|local={{ duration: 200 }}>
					{getPrincipalErrorMessage(value.principal, index, groupOfValue)}
				</p>
			{/if}
			<Label for="name-input-{index}" class="mb-2 mt-3 block">
				{$i18n.userdata.text.principal_alias} <span class="text-red-500">*</span>
			</Label>
			<Input
				type="text"
				id="name-input-{index}"
				placeholder={$i18n.userdata.placeholder.alias_name}
				bind:value={value.name}
				on:input={() => (buttonDisabled = handleInputs('name', value, groupOfValue))}
				on:blur={() => (buttonDisabled = handleInputs('name', value, groupOfValue))}
			/>
			{#if shouldShowPrincipalAliasError(value)}
				<p class="mt-2 text-sm text-muted-foreground" transition:slide|local={{ duration: 200 }}>
					{getPrincipalAliasErrorMessage(value.name)}
				</p>
			{/if}
		</div>
	{/each}
</div>
