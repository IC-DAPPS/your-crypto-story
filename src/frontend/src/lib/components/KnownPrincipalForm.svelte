<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { backInOut } from 'svelte/easing';
	import { alerterStore } from '$lib/stores/alerter.store';
	import { authStore } from '$lib/stores/auth.store';
	import type { PrincipalName, Result_2 } from '../../../../declarations/backend/backend.did';
	import Label from 'flowbite-svelte/Label.svelte';
	import Input from 'flowbite-svelte/Input.svelte';
	import Button from 'flowbite-svelte/Button.svelte';
	import Helper from 'flowbite-svelte/Helper.svelte';
	import { Principal } from '@dfinity/principal';
	import CloseCircleOutline from 'flowbite-svelte-icons/CloseCircleOutline.svelte';
	import Spinner from 'flowbite-svelte/Spinner.svelte';

	const dispatch = createEventDispatcher();

	type InputValue = {
		name: string;
		principal: string;
		nameInputTouched: boolean;
		principalInputTouched: boolean;
	};

	let groupOfValue: InputValue[] = [];

	let buttonDisabled = false;

	function validatePrincipal(textPrincipal: string): boolean {
		try {
			Principal.fromText(textPrincipal);
			return true;
		} catch (error) {
			return false;
		}
	}

	function validateName(name: string): boolean {
		return name.trim().length >= 3 && name.length <= 60;
	}

	function isPrincipalUnique(principal: string, index: number): boolean {
		return groupOfValue.every((value, i) => i === index || value.principal !== principal);
	}

	function handleInputs(value: InputValue, field: 'name' | 'principal') {
		if (field === 'name') {
			value.name = value.name.replace(/^\s+/, ''); // Remove leading whitespace
			value.nameInputTouched = true;
		} else {
			value.principalInputTouched = true;
		}
		updateButtonState();
	}

	function updateButtonState() {
		buttonDisabled = groupOfValue.some(
			(value, index) =>
				!validateName(value.name) ||
				!validatePrincipal(value.principal) ||
				!isPrincipalUnique(value.principal, index)
		);
	}

	function addNewAccount() {
		groupOfValue = [
			...groupOfValue,
			{
				name: '',
				principal: '',
				nameInputTouched: false,
				principalInputTouched: false
			}
		];
		updateButtonState();
	}

	function shouldShowNameError(value: InputValue): boolean {
		return value.nameInputTouched && !validateName(value.name);
	}

	function shouldShowPrincipalError(value: InputValue, index: number): boolean {
		return (
			value.principalInputTouched &&
			(!validatePrincipal(value.principal) || !isPrincipalUnique(value.principal, index))
		);
	}

	function getNameErrorMessage(name: string): string {
		if (name.trim().length < 3) {
			return 'Minimum three non-whitespace characters.';
		} else if (name.length > 60) {
			return 'Maximum 60 characters allowed.';
		}
		return '';
	}

	function getPrincipalErrorMessage(principal: string, index: number): string {
		if (!validatePrincipal(principal)) {
			return 'Input valid Principal.';
		} else if (!isPrincipalUnique(principal, index)) {
			return 'Principal must be unique.';
		}
		return '';
	}

	function deleteValue(index: number) {
		groupOfValue = groupOfValue.filter((_, i) => i !== index);
		updateButtonState();
	}

	async function insertOwnedPrincipal() {
		updateButtonState();
		let knownPrincipals: PrincipalName[] = [];
		for (let value of groupOfValue) {
			try {
				let principal = Principal.fromText(value.principal);
				knownPrincipals.push({ principal, name: value.name });
			} catch (error) {
				alerterStore.show({
					level: 'error',
					message: 'Failed to convert ' + value.principal + ' into Principal'
				});
				return; // Exit the function if an error occurs
			}
		}
		if (knownPrincipals.length > 0) {
			try {
				spinnerOn = true;
				const result = await $authStore.actor.insert_known_principals(knownPrincipals);
				spinnerOn = false;
				handleResult(result);
			} catch (error) {
				alerterStore.show({
					level: 'error',
					message: 'Failed to submit. Backend communication issues.'
				});
				console.error(error);
			}
		} else {
			skipStep();
		}
	}

	function handleResult(result: Result_2) {
		if ('Ok' in result) {
			complete = true;
			dispatch('complete', { success: true });
		} else {
			if ('AnonymousCaller' in result.Err) {
				alerterStore.show({ level: 'error', message: 'Anonymous user, please Log in.' });
			} else if ('DidntFindUserData' in result.Err) {
				alerterStore.show({ level: 'error', message: 'Failed! Please register or Log in.' });
			}
			dispatch('complete', { success: false, error: result.Err });
		}
	}

	function skipStep() {
		complete = true;
		dispatch('complete', { skipped: true });
	}

	let spinnerOn = false;
	export let complete = false;
</script>

<div
	class="flex items-center flex-col mt-2"
	in:fly={{ x: '-100%', duration: 500, delay: 380 }}
	out:fly={{ x: '100%', duration: 500 }}
>
	<div class="max-w-xl w-full">
		<p
			class="text-sm font-medium text-primary-800 dark:text-primary-200 max-sm:px-3 mb-2 text-start primary"
		>
			Add known Principals such as friends, family, organizations, or platforms.
		</p>
	</div>

	<div class="flex justify-between max-w-xl w-full max-sm:px-3">
		<Button class="border-primary-500 border-2" color="alternative" on:click={addNewAccount}
			>Add new
		</Button>
		<div>
			<Button disabled={buttonDisabled || spinnerOn} on:click={insertOwnedPrincipal}>
				{#if spinnerOn}
					<Spinner class="me-3 dark:text-white" size="4" />Submitting...
				{:else}
					Submit
				{/if}
			</Button>
			<Button color="light" disabled={spinnerOn} on:click={skipStep}>Skip</Button>
		</div>
	</div>
	{#each groupOfValue as value, index (index)}
		<div
			id="value-div"
			class="m-6 max-w-xl w-full border p-3 rounded"
			in:fly={{ y: '100vh', duration: 500 }}
			out:fly={{ x: '100%', duration: 500 }}
			animate:flip={{ duration: 700, delay: 300, easing: backInOut }}
		>
			<div class="flex justify-between mb-2">
				<Label for="principal-input-{index}" class="block"
					>Your Principal <span class="text-red-500">*</span>
				</Label>

				<button
					class="hover:animate-bounce dark:text-primary-50"
					on:click={() => deleteValue(index)}><CloseCircleOutline /></button
				>
			</div>
			<Input
				type="text"
				id="principal-input-{index}"
				placeholder="Principal"
				bind:value={value.principal}
				on:input={() => handleInputs(value, 'principal')}
				on:blur={() => handleInputs(value, 'principal')}
				color={shouldShowPrincipalError(value, index) ? 'red' : 'base'}
			/>
			{#if shouldShowPrincipalError(value, index)}
				<Helper class="mt-2" color="red">{getPrincipalErrorMessage(value.principal, index)}</Helper>
			{/if}
			<Label for="name-input-{index}" class="block mb-2 mt-3">
				Account Name | Platform Name <span class="text-red-500">*</span>
			</Label>
			<Input
				type="text"
				id="name-input-{index}"
				placeholder="Name"
				bind:value={value.name}
				on:input={() => handleInputs(value, 'name')}
				on:blur={() => handleInputs(value, 'name')}
				maxlength="60"
				color={shouldShowNameError(value) ? 'red' : 'base'}
			/>
			{#if shouldShowNameError(value)}
				<Helper class="mt-2" color="red">{getNameErrorMessage(value.name)}</Helper>
			{/if}
		</div>
	{/each}
</div>
