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
import { API_ROUTES } from '$lib/constants';

// standardize the typing for use across the application
export type AppProvider = ethers.providers.Web3Provider;

export type SignInMethod = 'social' | 'wallet';

export interface SmartAccountStore {
	smartAccount: BiconomySmartAccountV2 | undefined;
	loading: boolean;
	error: string | undefined;
	provider: AppProvider | undefined;
	address: `0x${string}` | undefined;
	isConnected: boolean;
	connectKit: ParticleConnect | undefined;
	signInMethod: SignInMethod | undefined;
	eoa: EthereumAddress | undefined;
	username: string | undefined;
}

const defaults: SmartAccountStore = {
	smartAccount: undefined,
	loading: false,
	error: undefined,
	provider: undefined,
	address: undefined,
	signInMethod: undefined,
	isConnected: false,
	connectKit: undefined,
	eoa: undefined,
	username: undefined
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

async function fetchUsername(scw: EthereumAddress): Promise<string | null> {
	try {
		const response = await fetch(`${API_ROUTES.GET.USER}?scw=${encodeURIComponent(scw)}`);
		if (!response.ok && response.status !== 404) {
			throw new Error(`Error: ${response.statusText}`);
		} else if (response.status === 404) {
			return null;
		}
		const data = await response.json();
		return data?.user?.username;
	} catch (error) {
		console.warn('Failed to fetch username:', error);
		return null;
	}
}

export async function initAccountStore(
	store: typeof accountStore,
	chainId: number,
	provider: providers.Web3Provider,
	signInMethod: SignInMethod
) {
	try {
		const scw = await biconomy.getSmartAccount({ chainId, provider });
		const address = (await scw?.getAccountAddress()) as EthereumAddress;
		const eoa = (await provider.getSigner().getAddress()) as EthereumAddress;
		const username = await fetchUsername(address as EthereumAddress);

		store.update((state) => ({
			...state,
			smartAccount: scw,
			provider,
			username: username ?? undefined,
			address,
			signInMethod,
			isConnected: true,
			eoa
		}));
	} catch (error) {
		console.error(error);

		store.update((state) => ({
			...state,
			error: 'Error fetching account details'
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
		signInMethod: undefined,
		loading: false,
		error: undefined,
		provider: undefined,
		eoa: undefined,
		address: undefined,
		isConnected: false,
		username: undefined
	});
}
