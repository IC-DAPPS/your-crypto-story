import type { IcrcMetadata, IndexCanisterId } from '$lib/types/icrc-metadata';
import { readable, type Readable } from 'svelte/store';
import icrcTokens from '@env/tokens.icrc.json';

export type IcrcMetadataMap = Map<IndexCanisterId, IcrcMetadata>;

const getIcrcMetadataMap = (): IcrcMetadataMap => {
	const keyValuePairs: [IndexCanisterId, IcrcMetadata][] = icrcTokens.map(
		({ indexCanisterId, ...icrcMetadata }) => [indexCanisterId, icrcMetadata]
	);
	return new Map(keyValuePairs);
};

export const icrcMetadata: Readable<IcrcMetadataMap> = readable(getIcrcMetadataMap());
