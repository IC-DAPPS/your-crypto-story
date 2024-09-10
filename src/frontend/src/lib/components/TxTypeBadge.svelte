<script lang="ts">
	import SortHorizontalOutline from 'flowbite-svelte-icons/SortHorizontalOutline.svelte';
	import FireOutline from 'flowbite-svelte-icons/FireOutline.svelte';
	import LandmarkOutline from 'flowbite-svelte-icons/LandmarkOutline.svelte';
	import BadgeCheckOutline from 'flowbite-svelte-icons/BadgeCheckOutline.svelte';
	import Badge from 'flowbite-svelte/Badge.svelte';

	export let type: string;
</script>

{#if type === 'Transfer'}
	<Badge color="purple"><SortHorizontalOutline class="h-4" />Transfer</Badge>
{:else if type === 'Mint'}
	<Badge color="green"><LandmarkOutline class="h-4" />Mint</Badge>
{:else if type === 'Burn'}
	<Badge color="red"><FireOutline class="h-4" />Burn</Badge>
{:else if type === 'Approve'}
	<Badge color="yellow"><BadgeCheckOutline class="h-4" />Approve</Badge>
{/if}
