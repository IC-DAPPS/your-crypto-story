<script>
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<NavBar />
<slot />

<style lang="postcss" global>
	:global(html) {
		background-color: theme(colors.gray.400);
	}
</style>
