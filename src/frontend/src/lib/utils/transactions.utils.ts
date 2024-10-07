import { getTransactions } from '$lib/api/icrc.index.api';
import type { PrincipalNameMap } from '$lib/types/principal-name';
import type {
	TransformedTransactions,
	TransformedTransaction,
	AliasAccount,
	GetTransformedTransactionsParams
} from '$lib/types/transaction';
import { encodeIcrcAccount } from '@dfinity/ledger-icrc';
import type {
	TransactionWithId,
	Transfer,
	Account,
	Burn,
	Mint,
	Approve
} from '@dfinity/ledger-icrc/dist/candid/icrc_index-ng';

export const getTransformedTransactions = async ({
	identity,
	owner,
	indexCanisterId,
	principalNameMap,
	decimals,
	symbol
}: GetTransformedTransactionsParams): Promise<TransformedTransactions> => {
	const {
		balance,
		oldest_tx_id,
		transactions: txsWithIds
	} = await getTransactions({
		identity,
		max_results: BigInt(50),
		account: { owner },
		canisterId: indexCanisterId
	});

	return transformTransactions(txsWithIds, indexCanisterId, principalNameMap, decimals, symbol);
};

export const transformTransactions = (
	txsWithIds: Array<TransactionWithId>,
	indexCanisterId: string,
	principalNameMap: PrincipalNameMap,
	decimals: number,
	symbol: string
): TransformedTransactions => {
	return txsWithIds.map((txWithId) => {
		return transformSingleTx(txWithId, indexCanisterId, principalNameMap, decimals, symbol);
	});
};

export const transformSingleTx = (
	{ transaction, id }: TransactionWithId,
	indexCanisterId: string,
	map: PrincipalNameMap,
	decimals: number,
	symbol: string
): TransformedTransaction => {
	const { timestamp, transfer, approve, burn, mint } = transaction;
	if (transfer[0]) {
		return transformTransferTx(transfer[0], timestamp, id, indexCanisterId, map, decimals);
	} else if (approve[0]) {
		return transformApproveTx(approve[0], timestamp, id, indexCanisterId, map, decimals);
	} else if (burn[0]) {
		return transformBurnTx(burn[0], timestamp, id, indexCanisterId, map, decimals, symbol);
	} else if (mint[0]) {
		return transformMintTx(mint[0], timestamp, id, indexCanisterId, map, decimals, symbol);
	} else {
		throw new Error('Invalid or unsupported transaction type');
	}
};

const transformTransferTx = (
	transfer: Transfer,
	timestamp: bigint,
	id: bigint,
	indexCanisterId: string,
	map: PrincipalNameMap,
	decimals: number
): TransformedTransaction => {
	return {
		indexCanisterId,
		block_id: Number(id),
		type: 'Transfer',
		timestamp: Number(timestamp),
		to: getAliasAccount(transfer.to, map),
		fee: getFee(transfer.fee, decimals),
		from: getAliasAccount(transfer.from, map),
		memo: memoToHex(transfer.memo),
		created_at_time: getAtTime(transfer.created_at_time),
		amount: Number(transfer.amount) / 10 ** decimals,
		spender: getOptionalAliasAccount(transfer.spender, map)
	};
};

const transformApproveTx = (
	approve: Approve,
	timestamp: bigint,
	id: bigint,
	indexCanisterId: string,
	map: PrincipalNameMap,
	decimals: number
): TransformedTransaction => {
	return {
		indexCanisterId,
		block_id: Number(id),
		type: 'Approve',
		timestamp: Number(timestamp),
		to: getEmptyAliasAccount(),
		fee: getFee(approve.fee, decimals),
		from: getAliasAccount(approve.from, map),
		memo: memoToHex(approve.memo),
		created_at_time: getAtTime(approve.created_at_time),
		amount: Number(approve.amount) / 10 ** decimals,
		expected_allowance: getExpectedAllowance(approve.expected_allowance, decimals),
		expires_at: getAtTime(approve.expires_at),
		spender: getAliasAccount(approve.spender, map)
	};
};

const transformBurnTx = (
	burn: Burn,
	timestamp: bigint,
	id: bigint,
	indexCanisterId: string,
	map: PrincipalNameMap,
	decimals: number,
	tokenSymbol: string
): TransformedTransaction => {
	return {
		indexCanisterId,
		block_id: Number(id),
		type: 'Burn',
		timestamp: Number(timestamp),
		to: getMintingAliasAccount(tokenSymbol),
		fee: 0,
		from: getAliasAccount(burn.from, map),
		memo: memoToHex(burn.memo),
		created_at_time: getAtTime(burn.created_at_time),
		amount: Number(burn.amount) / 10 ** decimals,
		spender: getOptionalAliasAccount(burn.spender, map)
	};
};

const transformMintTx = (
	mint: Mint,
	timestamp: bigint,
	id: bigint,
	indexCanisterId: string,
	map: PrincipalNameMap,
	decimals: number,
	tokenSymbol: string
): TransformedTransaction => {
	return {
		indexCanisterId,
		block_id: Number(id),
		type: 'Mint',
		timestamp: Number(timestamp),
		to: getAliasAccount(mint.to, map),
		fee: 0,
		from: getMintingAliasAccount(tokenSymbol),
		memo: memoToHex(mint.memo),
		created_at_time: getAtTime(mint.created_at_time),
		amount: Number(mint.amount) / 10 ** decimals
	};
};

const getAliasAccount = ({ owner, subaccount }: Account, map: PrincipalNameMap): AliasAccount => {
	return {
		name: map.get(owner.toString()),
		encodedAccount: encodeIcrcAccount({ owner, subaccount: subaccount[0] })
	};
};

const getOptionalAliasAccount = (optAccount: [] | [Account], map: PrincipalNameMap) =>
	optAccount[0] ? getAliasAccount(optAccount[0], map) : undefined;

const getEmptyAliasAccount = (): AliasAccount => ({ name: null, encodedAccount: null });

const getMintingAliasAccount = (tokenSymbol: string): AliasAccount => ({
	name: `${tokenSymbol} Minting Account`,
	encodedAccount: null
});

const getFee = (fee: [] | [bigint], decimals: number): number => {
	return fee[0] ? Number(fee[0]) / 10 ** decimals : 0;
};

function memoToHex(input: [] | [Uint8Array | number[]]): string | undefined {
	if (input.length === 0) return undefined;

	const data = input[0];
	const len = data.length;
	const hexChars = new Array(len * 2);

	// Lookup table for hex values
	const hexTable = '0123456789abcdef';

	for (let i = 0, j = 0; i < len; i++) {
		const byte = data[i] & 0xff;
		hexChars[j++] = hexTable[byte >>> 4];
		hexChars[j++] = hexTable[byte & 0xf];
	}

	return hexChars.join('');
}

const getAtTime = (time: [] | [bigint]) => (time[0] ? Number(time[0]) : undefined);

const getExpectedAllowance = (allowance: [] | [bigint], decimals: number) =>
	allowance[0] ? Number(allowance[0]) / 10 ** decimals : undefined;
