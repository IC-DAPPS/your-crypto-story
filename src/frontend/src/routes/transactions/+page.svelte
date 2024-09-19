<script lang="ts">
	// import { writable } from 'svelte/store';

	// import TxTypeBadge from '$lib/components/TxTypeBadge.svelte';

	// import { transactionStore } from '$lib/stores/transactions.store';
	// import { ledgerMetadataStore } from '$lib/stores/ledgerMetadata.store';

	// let items: {
	// 	timestamp: number;
	// 	amount: number;
	// 	from: string;
	// 	to: string;
	// 	spender: string;
	// 	id: number;
	// 	type: string;
	// 	token: string;
	// }[] = [];

	// onMount(async () => {
	// 	let getUsdxTransactions: GetTransactions = await $authStore.usdxIndex.getTransactions({
	// 		max_results: BigInt(100),
	// 		account: {
	// 			owner: Principal.fromText('2bfxp-uzezm-gf5ny-ztks2-ybgzc-4dfjc-7gdhs-he2ek-vdjfk-w4yph-fqe')
	// 		}
	// 	});
	// 	let getCkUsdcTransactions: GetTransactions = await $authStore.ckUsdcIndex.getTransactions({
	// 		max_results: BigInt(100),
	// 		account: {
	// 			owner: Principal.fromText('2bfxp-uzezm-gf5ny-ztks2-ybgzc-4dfjc-7gdhs-he2ek-vdjfk-w4yph-fqe')
	// 		}
	// 	});
	// 	items = [
	// 		...transformTransactions(getUsdxTransactions.transactions, 'USDx'),
	// 		...transformTransactions(getCkUsdcTransactions.transactions, 'ckUSDC')
	// 	];
	// 	// sortTable('id');
	// 	// sortTable('timestamp');
	// });

	// function formatTimestamp(timestamp: number): string {
	// 	// Convert nanoseconds to milliseconds
	// 	const date = new Date(timestamp / 1000000);
	// 	const now = new Date();

	// 	const formatter = new Intl.DateTimeFormat('en-US', {
	// 		year: 'numeric',
	// 		month: '2-digit',
	// 		day: '2-digit',
	// 		hour: '2-digit',
	// 		minute: '2-digit',
	// 		second: '2-digit',
	// 		hour12: true,
	// 		timeZone: 'UTC'
	// 	});

	// 	const formattedDate = formatter.format(date).replace(',', '');
	// 	const [datePart, timePart] = formattedDate.split(' ');
	// 	const [month, day, year] = datePart.split('/');
	// 	const formattedDateTime = `${year}-${month}-${day}, ${timePart} UTC`;

	// 	const diffMs = now.getTime() - date.getTime();
	// 	const diffMinutes = Math.floor(diffMs / 60000);
	// 	const diffHours = Math.floor(diffMs / 3600000);
	// 	const diffDays = Math.floor(diffMs / 86400000);
	// 	const diffWeeks = Math.floor(diffDays / 7);
	// 	const diffMonths =
	// 		(now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

	// 	let relativeTime: string;
	// 	if (diffMinutes < 60) {
	// 		relativeTime = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
	// 	} else if (diffHours < 24) {
	// 		relativeTime = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
	// 	} else if (diffDays < 7) {
	// 		relativeTime = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
	// 	} else if (diffWeeks < 4) {
	// 		relativeTime = `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
	// 	} else if (diffMonths < 12) {
	// 		relativeTime = `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
	// 	} else {
	// 		const diffYears = Math.floor(diffMonths / 12);
	// 		relativeTime = `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
	// 	}

	// 	return `${formattedDateTime}, ${relativeTime}`;
	// }

	// const sortKey = writable('timestamp'); // default sort key (timestamp)
	// const sortDirection = writable(-1); // default sort direction (descending)
	// $: sortItems = writable(items.slice()); // make a copy of the items array

	// $: sortItems = writable($transactionStore.slice());

	// Define a function to sort the items
	// const sortTable = (key: any) => {
	// 	// If the same key is clicked, reverse the sort direction
	// 	if ($sortKey === key) {
	// 		sortDirection.update((val) => -val);
	// 	} else {
	// 		sortKey.set(key);
	// 		sortDirection.set(1);
	// 	}
	// };

	// $: {
	// 	const key = $sortKey;
	// 	const direction = $sortDirection;
	// 	const sorted = [...$sortItems].sort((a, b) => {
	// 		const aVal = a[key];
	// 		const bVal = b[key];
	// 		if (aVal < bVal) {
	// 			return -direction;
	// 		} else if (aVal > bVal) {
	// 			return direction;
	// 		}
	// 		return 0;
	// 	});
	// 	sortItems.set(sorted);
	// }

	// $: {
	// console.log($transactionStore.length);
	// }
</script>
