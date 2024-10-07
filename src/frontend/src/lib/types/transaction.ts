import type { Principal } from '@dfinity/principal';
import type { Option } from './utils';
import type { Identity } from '@dfinity/agent';
import type { PrincipalNameMap } from './principal-name';

export interface AliasAccount {
	name: Option<string>;
	encodedAccount: Option<string>;
}

export interface TransformedTransaction {
	indexCanisterId: string;
	block_id: number; // Block Index
	type: 'Burn' | 'Mint' | 'Approve' | 'Transfer';
	timestamp: number;
	to: AliasAccount;
	fee: number; // for Transfer and Approve there is a fee . for Mint and Burn there is no fee
	from: AliasAccount;
	memo?: string;
	created_at_time?: number;
	amount: number;
	spender?: AliasAccount;
	expected_allowance?: number;
	expires_at?: number;
}

export type TransformedTransactions = Array<TransformedTransaction>;

export interface GetTransformedTransactionsParams {
	indexCanisterId: string;
	decimals: number;
	symbol: string;
	identity: Identity;
	owner: Principal;
	principalNameMap: PrincipalNameMap;
}
