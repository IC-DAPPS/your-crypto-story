<script lang="ts">
	import Alert from 'flowbite-svelte/Alert.svelte';
	import InfoCircleSolid from 'flowbite-svelte-icons/InfoCircleSolid.svelte';
	import CheckCircleSolid from 'flowbite-svelte-icons/CheckCircleSolid.svelte';
	import CloseCircleSolid from 'flowbite-svelte-icons/CloseCircleSolid.svelte';
	import BellRingSolid from 'flowbite-svelte-icons/BellRingSolid.svelte';
	import { slide } from 'svelte/transition';
	import { alerterStore } from '$lib/stores/alerter.store';

	function removeAlert(index: number) {
		alerterStore.remove(index);
	}

	export function getColor(
		level?: 'primary' | 'success' | 'error' | 'info' | 'warn'
	): 'green' | 'primary' | 'red' | 'blue' | 'yellow' {
		switch (level) {
			case 'success':
				return 'green';
			case 'error':
				return 'red';
			case 'info':
				return 'blue';
			case 'warn':
				return 'yellow';
			case 'primary':
			default:
				return 'primary';
		}
	}
</script>

{#each $alerterStore as alert, index (alert)}
	<div class="flex justify-center" in:slide={{ duration: 300 }} out:slide>
		<Alert
			on:click={() => removeAlert(index)}
			transition={slide}
			class="m-3 max-w-md w-full"
			border
			color={getColor(alert.level)}
			dismissable
		>
			{#if alert.level === 'success'}
				<CheckCircleSolid slot="icon" class="w-5 h-5 inline mr-3" /> {alert.message}
			{:else if alert.level === 'error'}
				<CloseCircleSolid slot="icon" class="w-5 h-5 inline mr-3" />{alert.message}
			{:else if alert.level === 'primary' || alert.level === undefined}
				<BellRingSolid slot="icon" class="w-5 h-5 inline mr-3" />{alert.message}
			{:else}
				<InfoCircleSolid slot="icon" class="w-5 h-5 inline mr-3" />{alert.message}
			{/if}
		</Alert>
	</div>
{/each}
