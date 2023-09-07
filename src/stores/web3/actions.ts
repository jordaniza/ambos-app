import type { Writable } from 'svelte/store';
import type { Web3Store } from '.';
import type { ChainId } from '@biconomy/core-types';
import { IS_TESTNET } from '$lib/constants';

export function setChainId(store: Writable<Web3Store>, chainId: ChainId) {
	store.update((s) => {
		s.isTestnet = IS_TESTNET[chainId] ?? false;
		s.chainId = chainId;
		return s;
	});
}
