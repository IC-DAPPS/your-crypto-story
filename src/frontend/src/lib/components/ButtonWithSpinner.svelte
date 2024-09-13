<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Loader } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	export let disabled: boolean = false;

	let spinner = false;
	export let onClick: () => Promise<void> | void = () => {};

	async function handleClick() {
		if (!spinner) {
			spinner = true;
			try {
				await onClick();
			} finally {
				spinner = false;
			}
		}
	}
</script>

<Button class={$$props.class} {disabled} on:click={handleClick}>
	{#if spinner}
		<div
			in:fly={{ delay: 300, duration: 300, x: -50, opacity: 0 }}
			out:fly={{ duration: 200, x: -50, opacity: 0 }}
		>
			<Loader class={twMerge('h-7 w-7 animate-spin', $$props.loaderClass)} />
		</div>
	{:else}
		<div
			in:fly={{ delay: 200, duration: 300, x: 50, opacity: 0 }}
			out:fly={{ duration: 200, x: 50, opacity: 0 }}
		>
			<slot />
		</div>
	{/if}
</Button>
