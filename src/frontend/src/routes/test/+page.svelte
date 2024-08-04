<script lang="ts">
	import { page } from '$app/stores';
	import DarkModeButton from '$lib/components/DarkModeButton.svelte';
	import { Sidebar, Button, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import {
		ChartPieSolid,
		GridSolid,
		MailBoxSolid,
		UserSolid,
		ArrowRightToBracketOutline,
		EditOutline
	} from 'flowbite-svelte-icons';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	$: activeUrl = $page.url.pathname;
</script>

<DarkModeButton />
