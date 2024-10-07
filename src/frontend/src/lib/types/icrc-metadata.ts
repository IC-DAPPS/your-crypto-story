export interface IcrcMetadata {
	ledgerCanisterId: string;
	metadata: {
		logo: string;
		decimals: number;
		name: string;
		symbol: string;
		fee: number;
		max_memo_length: number;
	};
}

export type IndexCanisterId = string;
