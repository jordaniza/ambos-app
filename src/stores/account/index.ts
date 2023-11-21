import type { BiconomySmartAccountV2 } from '@biconomy/account';
import * as _0x from '@0xsequence/multicall';
import * as biconomy from './biconomy';
import * as particle from './particle';
import { writable } from 'svelte/store';
import type { MulticallProvider } from '@0xsequence/multicall/dist/declarations/src/providers';
import { get } from 'svelte/store';
import type { ParticleConnect } from '@particle-network/connect';
import type { ethers, providers } from 'ethers';
import type { EthereumAddress } from '$lib/utils';

// standardize the typing for use across the application
export type AppProvider = ethers.providers.Web3Provider;

export interface SmartAccountStore {
	smartAccount: BiconomySmartAccountV2 | undefined;
	loading: boolean;
	error: string | undefined;
	provider: AppProvider | undefined;
	address: `0x${string}` | undefined;
	isConnected: boolean;
	connectKit: ParticleConnect | undefined;
}

const defaults: SmartAccountStore = {
	smartAccount: undefined,
	loading: false,
	error: undefined,
	provider: undefined,
	address: undefined,
	isConnected: false,
	connectKit: undefined
};

export const accountStore = writable<SmartAccountStore>(defaults);

export function initMulticallProvider(
	provider: providers.Web3Provider | undefined
): MulticallProvider | undefined {
	return provider && new _0x.providers.MulticallProvider(provider);
}

export function setConnectKit(store: typeof accountStore, chainId: number): ParticleConnect {
	const connectKit = particle.initConnectKit(chainId);
	store.update((state) => ({ ...state, connectKit }));
	return connectKit;
}

export async function initAccountStore(
	store: typeof accountStore,
	chainId: number,
	provider: providers.Web3Provider
) {
	try {
		store.update((state) => ({ ...state, loading: true }));

		const scw = await biconomy.getSmartAccount({ chainId, provider });
		const address = (await scw?.getAccountAddress()) as EthereumAddress;

		store.update((state) => ({
			...state,
			smartAccount: scw,
			provider,
			address,
			isConnected: true,
			loading: false
		}));
	} catch (error) {
		console.error(error);

		store.update((state) => ({
			...state,
			error: 'Error fetching account details',
			loading: false
		}));
	}
}

export async function disconnect(store: typeof accountStore) {
	const connectKit = get(store).connectKit;

	if (!connectKit) {
		throw new Error('ConnectKit is not initialized');
	}

	await particle.signOut(connectKit);

	store.set({
		// keep the connectKit so we can reconnect if needed
		connectKit,
		smartAccount: undefined,
		loading: false,
		error: undefined,
		provider: undefined,
		address: undefined,
		isConnected: false
	});
}
