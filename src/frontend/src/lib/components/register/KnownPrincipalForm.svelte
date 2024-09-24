<script lang="ts">
	import { Input } from '@components/ui/input/index.js';
	import { Label } from '@components/ui/label/index.js';
	import { Button } from '@components/ui/button/index.js';
	import { createEventDispatcher } from 'svelte';
	import { fly, fade, slide, type TransitionConfig } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { alerterStore } from '@stores/alerter.store';
	import { authStore } from '@stores/auth.store';
	import type { PrincipalName, Result_2 } from '@declarations/backend/backend.did';
	import { Principal } from '@dfinity/principal';
	import { CircleX } from 'lucide-svelte';
	import ButtonWithSpinner from '../ButtonWithSpinner.svelte';

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

	async function insertKnownPrincipal() {
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
				// spinnerOn = true;
				// const result = await $authStore.actor.insert_known_principals(knownPrincipals);
				// spinnerOn = false;
				// handleResult(result);
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

	function smoothFly(
		node: Element,
		{ delay = 0, duration = 400 }: { delay?: number; duration?: number }
	): TransitionConfig {
		return {
			delay,
			duration,
			css: (t: number) => {
				const eased = cubicOut(t);
				return `
          opacity: ${eased};
          transform: translateY(${(1 - eased) * 20}px)
        `;
			}
		};
	}
</script>

<div
	class="mt-2 flex flex-col items-center"
	in:fly={{ x: '-100%', duration: 500, delay: 380 }}
	out:fly={{ x: '100%', duration: 400 }}
>
	<div class="w-full max-w-xl">
		<p class="mb-2 text-start text-sm font-medium max-sm:px-3">
			Add known Principals such as friends, family, organizations, or platforms.
		</p>
	</div>
	<hr />
	<div class="flex w-full max-w-xl justify-between max-sm:px-3">
		<Button variant="outline" on:click={addNewAccount}>Add new</Button>
		<div class="flex">
			<ButtonWithSpinner class="w-24" disabled={buttonDisabled} onClick={insertKnownPrincipal}>
				Submit
			</ButtonWithSpinner>
			<Button class="ml-2 w-24" variant="secondary" disabled={spinnerOn} on:click={skipStep}>
				Skip
			</Button>
		</div>
	</div>
	{#each groupOfValue as value, index (index)}
		<div
			id="value-div"
			class="m-6 w-full max-w-xl rounded border p-3"
			in:smoothFly={{ delay: index * 100, duration: 400 }}
			out:fade={{ duration: 300 }}
		>
			<div class="mb-2 flex justify-between">
				<Label for="principal-input-{index}" class="block"
					>Your Principal <span class="text-red-500">*</span>
				</Label>

				<button class="" on:click={() => deleteValue(index)}><CircleX /></button>
			</div>
			<Input
				type="text"
				id="principal-input-{index}"
				placeholder="Principal"
				bind:value={value.principal}
				on:input={() => handleInputs(value, 'principal')}
				on:blur={() => handleInputs(value, 'principal')}
			/>
			{#if shouldShowPrincipalError(value, index)}
				<p class="mt-2 text-sm text-muted-foreground" transition:slide|local={{ duration: 200 }}>
					{getPrincipalErrorMessage(value.principal, index)}
				</p>
			{/if}
			<Label for="name-input-{index}" class="mb-2 mt-3 block">
				Account Name | Platform Name <span class="text-red-500">*</span>
			</Label>
			<Input
				type="text"
				id="name-input-{index}"
				placeholder="Name"
				bind:value={value.name}
				on:input={() => handleInputs(value, 'name')}
				on:blur={() => handleInputs(value, 'name')}
			/>
			{#if shouldShowNameError(value)}
				<p class="mt-2 text-sm text-muted-foreground" transition:slide|local={{ duration: 200 }}>
					{getNameErrorMessage(value.name)}
				</p>
			{/if}
		</div>
	{/each}
</div>
