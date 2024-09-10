import { ListOfIndexCanisterIds } from '$lib/canisterIds';
import { getIcrcIndexCanister, getIcrcLedgerCanister } from '$lib/icrc';
import type { IcrcTokenMetadataResponse } from '@dfinity/ledger-icrc';
import type { Principal } from '@dfinity/principal';
import { writable, type Writable, get } from 'svelte/store';

// Key = Index canister Id value = Metada+ledgerId
type LedgerMetadataMap = Map<
	string,
	{ id: Principal; symbol: string; name: string; decimals: number; fee: number; logo: string }
>;

export interface LedgerMetadataStore extends Writable<LedgerMetadataMap> {
	sync: () => Promise<void>;
}

export function parseIcrcMetadata(
	metadata: IcrcTokenMetadataResponse,
	id: Principal
): { id: Principal; symbol: string; name: string; decimals: number; fee: number; logo: string } {
	const result = {
		id,
		symbol: '',
		name: '',
		decimals: 0,
		fee: 0,
		logo: ''
	};

	const metadataLength = metadata.length;
	for (let i = 0; i < metadataLength; i++) {
		const [key, value] = metadata[i];

		switch (key) {
			case 'icrc1:symbol':
				if ('Text' in value) result.symbol = value.Text;
				break;
			case 'icrc1:name':
				if ('Text' in value) result.name = value.Text;
				break;
			case 'icrc1:decimals':
				if ('Nat' in value) result.decimals = Number(value.Nat);
				break;
			case 'icrc1:fee':
				if ('Nat' in value) result.fee = Number(value.Nat);
				break;
			case 'icrc1:logo':
				if ('Text' in value) result.logo = value.Text;
				break;
		}

		if (result.symbol && result.name && result.decimals && result.fee && result.logo) {
			break; // Exit early if all fields are filled
		}
	}

	return result;
}

function createLedgerMetadataStore(): LedgerMetadataStore {
	const storageKey = 'ledgerMetadata';

	// Try to load initial value from local storage
	const storedValue = localStorage.getItem(storageKey);
	const initialValue: LedgerMetadataMap = storedValue
		? new Map(JSON.parse(storedValue))
		: new Map();

	const store = writable<LedgerMetadataMap>(initialValue);

	// Sync to local storage whenever the store changes
	store.subscribe((value) => {
		localStorage.setItem(storageKey, JSON.stringify(Array.from(value)));
	});

	return {
		...store,
		sync: async () => {
			const ledgerMetadataMap: LedgerMetadataMap = get(store);

			ListOfIndexCanisterIds.forEach(async (canisterId) => {
				const { ledgerId } = getIcrcIndexCanister(canisterId);
				const id: Principal = await ledgerId({ certified: false });
				const { metadata } = getIcrcLedgerCanister(id);
				const data = await metadata({ certified: false });
				const value = parseIcrcMetadata(data, id);
				ledgerMetadataMap.set(canisterId, value);
			});
			store.set(ledgerMetadataMap);
			console.log('ledgerMetadataMap', ledgerMetadataMap);
		}
	};
}

export const ledgerMetadataStore = createLedgerMetadataStore();

await ledgerMetadataStore.sync();
