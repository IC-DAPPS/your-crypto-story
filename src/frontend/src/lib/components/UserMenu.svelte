<!-- <script lang="ts">
	import Avatar from 'flowbite-svelte/Avatar.svelte';
	import Dropdown from 'flowbite-svelte/Dropdown.svelte';
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import DropdownHeader from 'flowbite-svelte/DropdownHeader.svelte';
	import DropdownDivider from 'flowbite-svelte/DropdownDivider.svelte';
	import { authStore } from '$lib/stores/auth.store';
</script>

<Avatar id="avatar-menu">Bo</Avatar>
<Dropdown placement="bottom" triggeredBy="#avatar-menu">
	<DropdownHeader>
		<span class="block text-sm">Bonnie Green</span>
		<span class="block truncate text-sm font-medium">name@flowbite.com</span>
	</DropdownHeader>
	<DropdownItem>Your Principals</DropdownItem>
	<DropdownItem>Known Principals</DropdownItem>

	<DropdownItem>Settings</DropdownItem>

	<DropdownDivider />
	<DropdownItem on:click={authStore.signOut}>Sign out</DropdownItem>
</Dropdown> -->
