import { writable, get, type Readable } from 'svelte/store';
import { userStore } from './user.store';
import type { TransformedTransaction } from '$lib/types/transaction';
import icrcTokens from '@env/tokens.icrc.json';
import { getPrincipalNameMap } from '@utils/principal-name.utils';
import { getTransformedTransactions } from '@utils/transactions.utils';
import { authStore } from './auth.store';
import { AnonymousIdentity } from '@dfinity/agent';

export type TransactionData = TransformedTransaction[];

export interface TransactionStore extends Readable<TransactionData> {
	sync: () => Promise<void>;
}

const initTransactionStore = (): TransactionStore => {
	const { set, subscribe, update } = writable<TransactionData>([]);

	return {
		subscribe,
		sync: async () => {
			try {
				let transactionData: TransactionData = [];
				let principalNameMap = getPrincipalNameMap();
				let identity = get(authStore).identity ?? new AnonymousIdentity();
				const { owned_principals } = get(userStore).userData;

				owned_principals.forEach(async ({ principal }) => {
					icrcTokens.forEach(async ({ indexCanisterId, metadata: { decimals, symbol } }) => {
						const transformedTx = await getTransformedTransactions({
							identity,
							owner: principal,
							indexCanisterId,
							principalNameMap,
							decimals,
							symbol
						});

						transactionData.push(...transformedTx);
					});
				});
				set(transactionData);
			} catch (error) {
				console.error('Failed to sync transactions:', error);
			}
		}
	};
};

export const transactionStore = initTransactionStore();
