import { ListOfIndexCanisterIds } from '$lib/canisterIds';
import { getIcrcIndexCanister } from '$lib/icrc-index';
import { writable, type Writable, get } from 'svelte/store';
import { userStore } from './user.store';
import { Principal } from '@dfinity/principal';
import type { UserData } from '../../../../declarations/backend/backend.did';
import type {
	Transaction,
	TransactionWithId
} from '@dfinity/ledger-icrc/dist/candid/icrc_index-ng';
import { ledgerMetadataStore } from './ledgerMetadata.store';

export type TransactionData = {
	canisterId: string; //IndexCanisterId
	id: number;
	type: 'Burn' | 'Mint' | 'Approve' | 'Transfer';
	timestamp: number;
	to: string;
	fee?: number; // for Transfer and Approve there is a fee . for Mint and Burn there is no fee
	from: string;
	memo?: Uint8Array;
	created_at_time?: number;
	amount: number;
	spender?: string;
	expected_allowance?: number;
	expires_at?: number;
}[];

export interface TransactionStore extends Writable<TransactionData> {
	sync: () => Promise<void>;
}

function createTransactionStore(): TransactionStore {
	const storageKey = 'yourTransactions';

	const storedValue = localStorage.getItem(storageKey);
	const initialValue: TransactionData = storedValue ? JSON.parse(storedValue) : [];

	const store = writable<TransactionData>(initialValue);

	// Sync to local storage whenever the store changes
	store.subscribe((value) => {
		localStorage.setItem(storageKey, JSON.stringify(value));
	});

	return {
		...store,
		sync: async () => {
			const initialTime = Date.now();
			try {
				const userData = get(userStore).userData;
				console.log('user data', userData);
				const principalNameMap = createPrincipalNameMapOptimized(userData);
				const transactionData: TransactionData = [];
				userData.owned_principals.forEach(async ({ principal }) => {
					// const asyncFunctions: Promise<void>[] = [];
					ListOfIndexCanisterIds.forEach(async (canisterId) => {
						// asyncFunctions.push(
						await getTransactionsAndParseThem(
							canisterId,
							principalNameMap,
							principal,
							get(ledgerMetadataStore).get(canisterId)?.decimals ?? 0,
							transactionData,
							get(ledgerMetadataStore).get(canisterId)?.symbol
						);
						// );
					});
					// Promise.all(asyncFunctions).then(() => {
					// 	store.set(transactionData);
					// })

					// await Promise.all(asyncFunctions);
				});
				store.set(transactionData);
				console.log('Time difference in sec ', (Date.now() - initialTime) / 1000);
				console.log('Number of transactions', transactionData.length);
				console.log('Transactions', transactionData);
			} catch (error) {
				console.error('Failed to sync transactions:', error);
			}
		}
	};
}

async function getTransactionsAndParseThem(
	canisterId: string,
	principalNameMap: Map<string, string>,
	owner: Principal,
	decimals: number,
	transactionData: TransactionData,
	tokenSymbol?: string
) {
	const { getTransactions } = await getIcrcIndexCanister(canisterId);
	const transactionsWithBalanceAndOldestTxId = await getTransactions({
		max_results: BigInt(100),
		account: { owner },
		certified: false
	});

	transactionData.push(
		...parseTransactions(
			transactionsWithBalanceAndOldestTxId.transactions,
			canisterId,
			decimals,
			principalNameMap,
			tokenSymbol
		)
	);
}
function parseTransactions(
	transactions: Array<TransactionWithId>,
	canisterId: string,
	decimals: number,
	principalNameMap: Map<string, string>,
	tokenSymbol?: string
): TransactionData {
	return transactions.map(({ id, transaction }) => {
		return {
			canisterId,
			id: Number(id),
			...parseSingleTx(transaction, decimals, principalNameMap, tokenSymbol)
		};
	});
}

function parseSingleTx(
	transaction: Transaction,
	decimals: number,
	principalNameMap: Map<string, string>,
	tokenSymbol?: string
): {
	type: 'Burn' | 'Mint' | 'Approve' | 'Transfer';
	timestamp: number;
	to: string;
	fee?: number; // for Transfer and Approve there is a fee . for Mint and Burn there is no fee
	from: string;
	memo?: Uint8Array;
	created_at_time?: number;
	amount: number;
	spender?: string;
	expected_allowance?: number;
	expires_at?: number;
} {
	if (transaction.transfer[0]) {
		return {
			type: 'Transfer',
			created_at_time: transaction.transfer[0].created_at_time[0]
				? Number(transaction.transfer[0].created_at_time[0])
				: undefined,
			memo: transaction.transfer[0].memo[0]
				? transaction.transfer[0].memo[0] instanceof Uint8Array
					? transaction.transfer[0].memo[0]
					: new Uint8Array(transaction.transfer[0].memo[0])
				: undefined,
			amount: Number(transaction.transfer[0].amount) / 10 ** decimals,
			fee: transaction.transfer[0].fee[0]
				? Number(transaction.transfer[0].fee[0]) / 10 ** decimals
				: undefined,
			from:
				principalNameMap.get(transaction.transfer[0].from.owner.toString()) ??
				transaction.transfer[0].from.owner.toString(),
			to:
				principalNameMap.get(transaction.transfer[0].to.owner.toString()) ??
				transaction.transfer[0].to.owner.toString(),
			timestamp: Number(transaction.timestamp),
			spender: transaction.transfer[0].spender[0]
				? (principalNameMap.get(transaction.transfer[0].spender[0].owner.toString()) ??
					transaction.transfer[0].spender[0].owner.toString())
				: undefined
		};
	} else if (transaction.approve[0]) {
		return {
			type: 'Approve',
			fee: transaction.approve[0].fee[0]
				? Number(transaction.approve[0].fee[0]) / 10 ** decimals
				: undefined,
			from:
				principalNameMap.get(transaction.approve[0].from.owner.toString()) ??
				transaction.approve[0].from.owner.toString(),
			memo: transaction.approve[0].memo[0]
				? transaction.approve[0].memo[0] instanceof Uint8Array
					? transaction.approve[0].memo[0]
					: new Uint8Array(transaction.approve[0].memo[0])
				: undefined,
			created_at_time: transaction.approve[0].created_at_time[0]
				? Number(transaction.approve[0].created_at_time[0])
				: undefined,
			amount: Number(transaction.approve[0].amount) / 10 ** decimals,
			expected_allowance: transaction.approve[0].expected_allowance[0]
				? Number(transaction.approve[0].expected_allowance[0]) / 10 ** decimals
				: undefined,
			timestamp: Number(transaction.timestamp),
			expires_at: transaction.approve[0].expires_at[0]
				? Number(transaction.approve[0].expires_at[0])
				: undefined,
			spender:
				principalNameMap.get(transaction.approve[0].spender.owner.toString()) ??
				transaction.approve[0].spender.owner.toString(),
			to: ''
		};
	} else if (transaction.burn[0]) {
		return {
			type: 'Burn',
			from:
				principalNameMap.get(transaction.burn[0].from.owner.toString()) ??
				transaction.burn[0].from.owner.toString(),
			memo: transaction.burn[0].memo[0]
				? transaction.burn[0].memo[0] instanceof Uint8Array
					? transaction.burn[0].memo[0]
					: new Uint8Array(transaction.burn[0].memo[0])
				: undefined,
			created_at_time: transaction.burn[0].created_at_time[0]
				? Number(transaction.burn[0].created_at_time[0])
				: undefined,
			amount: Number(transaction.burn[0].amount) / 10 ** decimals,
			timestamp: Number(transaction.timestamp),
			to: tokenSymbol ? `${tokenSymbol} Minting Account` : 'Minting Account',
			spender: transaction.burn[0].spender[0]
				? (principalNameMap.get(transaction.burn[0].spender[0].owner.toString()) ??
					transaction.burn[0].spender[0].owner.toString())
				: undefined
		};
	} else if (transaction.mint[0]) {
		return {
			type: 'Mint',
			timestamp: Number(transaction.timestamp),
			from: tokenSymbol ? `${tokenSymbol} Minting Account` : 'Minting Account',
			to:
				principalNameMap.get(transaction.mint[0].to.owner.toString()) ??
				transaction.mint[0].to.owner.toString(),
			memo: transaction.mint[0].memo[0]
				? transaction.mint[0].memo[0] instanceof Uint8Array
					? transaction.mint[0].memo[0]
					: new Uint8Array(transaction.mint[0].memo[0])
				: undefined,
			created_at_time: transaction.mint[0].created_at_time[0]
				? Number(transaction.mint[0].created_at_time[0])
				: undefined,
			amount: Number(transaction.mint[0].amount) / 10 ** decimals
		};
	} else {
		throw new Error('Invalid or unsupported transaction type');
	}
}

function createPrincipalNameMapOptimized(userData: UserData): Map<string, string> {
	// const totalSize = userData.owned_principals.length + userData.known_principals.length;
	const principalNameMap = new Map<string, string>();
	const seenPrincipals = new Set<string>();

	// Pre-allocate for owned_principals
	userData.owned_principals.forEach(({ principal, name }) => {
		const principalText = principal.toText();
		if (!seenPrincipals.has(principalText)) {
			principalNameMap.set(principalText, name);
			seenPrincipals.add(principalText);
		}
	});

	// Add known_principals if not already present
	userData.known_principals.forEach(({ principal, name }) => {
		const principalText = principal.toText();
		if (!seenPrincipals.has(principalText)) {
			principalNameMap.set(principalText, name);
			seenPrincipals.add(principalText);
		}
	});

	return principalNameMap;
}

export const transactionStore = createTransactionStore();
