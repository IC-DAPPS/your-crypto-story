<script lang="ts">
	import Avatar from '@components/Avatar.svelte';
	import ButtonWithSpinner from '@components/ButtonWithSpinner.svelte';
	import { authStore } from '@stores/auth.store';
	import { page } from '$app/stores';
	import LightAndDarkToggle from '@components/LightAndDarkToggle.svelte';

	const Pages = [
		{ name: 'Home', link: '/' },
		{ name: 'Transactions', link: '/transactions/' },
		{ name: 'Portfolio', link: '/portfolio/' },
		{ name: 'Story', link: '/story/' }
	];
</script>

<nav class=" px-8 py-4">
	<div>
		<div class="flex items-center justify-between">
			<div class="text-2xl font-bold"><a href="/">Y C S</a></div>

			<ul class="hidden list-none gap-8 md:flex">
				{#each Pages as { name, link }, index (index)}
					<li>
						<a
							href={link}
							class="transition-colors duration-200 hover:text-accent-foreground {$page.url
								.pathname === link
								? 'font-bold text-primary'
								: 'font-light text-muted-foreground'}">{name}</a
						>
					</li>
				{/each}
			</ul>

			{#if $authStore.identity}
				<Avatar />
			{:else}
				<div class="flex items-center gap-4">
					<LightAndDarkToggle />
					<ButtonWithSpinner
						onClick={async () => authStore.signIn({ domain: 'internetcomputer.org' })}
						>Login</ButtonWithSpinner
					>
				</div>
			{/if}
		</div>
		<div class="overflow-x-auto md:hidden">
			<ul
				class="flex list-none justify-center gap-8 whitespace-nowrap pt-4 max-[396px]:justify-start"
			>
				{#each Pages as { name, link }, index (index)}
					<li>
						<a
							href={link}
							class="transition-colors duration-200 hover:text-accent-foreground {$page.url
								.pathname === link
								? 'font-bold text-primary'
								: 'font-light text-muted-foreground'}">{name}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>
