import { BiconomyAccountAbstractor } from './abstractor';
import type { BiconomySmartAccountV2 } from '@biconomy/account';
import type { IBundler } from '@biconomy/bundler';
import type { IPaymaster } from '@biconomy/paymaster';
import type { providers } from 'ethers';
import * as _0x from '@0xsequence/multicall';
import { writable } from 'svelte/store';
import type { MulticallProvider } from '@0xsequence/multicall/dist/declarations/src/providers';
import { get } from 'svelte/store';
import type { ParticleConnect } from '@particle-network/connect';

// standardize the typing for use across the application
export type AppProvider = MulticallProvider;

export interface SmartAccountStore {
	smartAccount: BiconomySmartAccountV2 | undefined;
	loading: boolean;
	error: string | undefined;
	provider: AppProvider | undefined;
	bundler: IBundler | undefined;
	paymaster: IPaymaster | undefined;
	userInfo?: any | undefined;
	address: `0x${string}` | undefined;
	isConnected: boolean;
	connectKit: ParticleConnect | undefined;
}

const defaults: SmartAccountStore = {
	smartAccount: undefined,
	loading: false,
	error: undefined,
	provider: undefined,
	bundler: undefined,
	address: undefined,
	paymaster: undefined,
	userInfo: undefined,
	isConnected: false,
	connectKit: undefined
};

export const accountStore = writable<SmartAccountStore>(defaults);

function initMulticallProvider(
	provider: providers.Web3Provider | undefined
): MulticallProvider | undefined {
	return provider && new _0x.providers.MulticallProvider(provider);
}

// pass a provider if wanted otherwise will use auth
export async function connect(
	store: typeof accountStore,
	chainId: number,
	provider?: providers.Web3Provider
) {
	const accountAbstractor = new BiconomyAccountAbstractor(chainId);
	try {
		store.update((state) => ({ ...state, loading: true }));
		if (!provider) {
			provider = accountAbstractor.getProvider();
			if (!provider) {
				throw new Error('Error fetching provider');
			}
		}
		const scw = await accountAbstractor.getSCW(provider);
		const multicallProvider = initMulticallProvider(provider);
		// const userInfo = await accountAbstractor.getUser();
		const bundler = accountAbstractor.getBundler();
		const paymaster = accountAbstractor.getPaymaster();
		const address = await scw?.getAccountAddress();

		store.update((state) => ({
			...state,
			smartAccount: scw,
			// userInfo,
			provider: multicallProvider,
			bundler,
			paymaster,
			address: address as `0x${string}`,
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
	// all settled doesn't throw an error if one of the promises fails
	await Promise.allSettled([
		get(store).connectKit?.disconnect(),
		get(store).connectKit?.particle.auth.logout()
	]);

	// await accountAbstractor.signOut();

	accountStore.set({
		...defaults,
		smartAccount: undefined,
		loading: false,
		error: undefined,
		provider: undefined,
		bundler: undefined,
		paymaster: undefined,
		userInfo: undefined,
		address: undefined,
		isConnected: false,
		connectKit: undefined
	});
}
