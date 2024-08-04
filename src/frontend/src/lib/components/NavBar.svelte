<script>
	import Navbar from 'flowbite-svelte/Navbar.svelte';
	import NavBrand from 'flowbite-svelte/NavBrand.svelte';
	import NavLi from 'flowbite-svelte/NavLi.svelte';
	import NavUl from 'flowbite-svelte/NavUl.svelte';
	import NavHamburger from 'flowbite-svelte/NavHamburger.svelte';
	import Button from 'flowbite-svelte/Button.svelte';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth.store';
	import UserMenu from '$lib/components/UserMenu.svelte';
	import DarkMode from 'flowbite-svelte/DarkMode.svelte';
	import DarkModeButton from '$lib/components/DarkModeButton.svelte';

	$: activeUrl = $page.url.pathname;
</script>

<Navbar class="border-b border-primary-400">
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>Your Crypto Story</span
		>
	</NavBrand>
	<div class="flex items-center md:order-2">
		<DarkModeButton btnClass="hidden md:block p-2 mr-3" />
		{#if $authStore.isAuthenticated}
			<UserMenu />
		{:else}
			<Button on:click={authStore.signIn}>Log in</Button>
		{/if}
		<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
	</div>

	<NavUl {activeUrl}>
		<NavLi href="/" active={true}>Home</NavLi>
		<NavLi href="/transactions">Transactions</NavLi>
		<NavLi href="/portfolio">Portfolio</NavLi>
		<NavLi href="/story">Your story</NavLi>
		<DarkMode
			btnClass="hidden max-md:block ml-3 rounded-full p-2 px-6 w-fit border-2 border-primary-200 text-primary-500 dark:border-white dark:text-white"
		/>
	</NavUl>
</Navbar>
