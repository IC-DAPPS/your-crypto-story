<script lang="ts">
	import * as Alert from '@components/ui/alert/index.js';
	import { slide } from 'svelte/transition';
	import { alerterStore } from '@stores/alerter.store';
	import { CircleCheck, Info, CircleX, BellRing, CircleAlert, X } from 'lucide-svelte';

	function removeAlert(index: number) {
		alerterStore.remove(index);
	}

	export function getColor(level?: 'primary' | 'success' | 'error' | 'info' | 'warn'): string {
		switch (level) {
			case 'success':
				return ' text-green-400 border border-green-400 ';
			case 'error':
				return ' text-red-400 border border-red-400 ';
			case 'info':
				return ' text-blue-400 border border-blue-400';
			case 'warn':
				return ' text-yellow-400 border border-yellow-400';
			case 'primary':
			default:
				return ' border';
		}
	}
</script>

{#each $alerterStore as alert, index (alert)}
	<div class="flex justify-center" in:slide={{ duration: 300 }} out:slide>
		<Alert.Root class={'bg m-2 w-full max-w-md' + getColor(alert.level)}>
			{#if alert.level === 'success'}
				<CircleCheck class="h-4 w-4" color="rgb(74 222 128)" />
			{:else if alert.level === 'error'}
				<CircleX class="h-4 w-4" color="rgb(248 113 113)" />
			{:else if alert.level === 'primary' || alert.level === undefined}
				<BellRing class="h-4 w-4" />
			{:else if alert.level === 'info'}
				<Info class="h-4 w-4" color="rgb(96 165 250)" />
			{:else}
				<CircleAlert class="h-4 w-4" color="rgb(250 204 21)" />
			{/if}

			{#if alert.title}
				<Alert.Title>{alert.title}</Alert.Title>
			{/if}
			<Alert.Description>
				<div class="flex justify-between">
					{alert.message}
					<button on:click={() => removeAlert(index)}><X /></button>
				</div>
			</Alert.Description>
		</Alert.Root>
	</div>
{/each}
