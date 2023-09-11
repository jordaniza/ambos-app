import { BiconomyAccountAbstractor } from './abstractor';
import type { BiconomySmartAccount } from '@biconomy/account';
import type { IBundler } from '@biconomy/bundler';
import type { IPaymaster } from '@biconomy/paymaster';
import type { providers } from 'ethers';
import { type Writable, writable } from 'svelte/store';

export interface SmartAccountStore {
	smartAccount: BiconomySmartAccount | undefined;
	loading: boolean;
	error: string | undefined;
	provider: providers.Web3Provider | undefined;
	bundler: IBundler | undefined;
	paymaster: IPaymaster | undefined;
	userInfo?: any | undefined;
	address: `0x${string}` | undefined;
	isConnected: boolean;
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
	isConnected: false
};

export const accountStore = writable<SmartAccountStore>(defaults);
export async function connect(chainId: number) {
	const accountAbstractor = new BiconomyAccountAbstractor(chainId);
	try {
		accountStore.update((state) => ({ ...state, loading: true }));
		const scw = await accountAbstractor.getSCW();
		const userInfo = await accountAbstractor.getUser();
		const provider = accountAbstractor.getProvider();
		const bundler = accountAbstractor.getBundler();
		const paymaster = accountAbstractor.getPaymaster();
		const address = await scw?.getSmartAccountAddress();
		accountStore.update((state) => ({
			...state,
			smartAccount: scw,
			userInfo,
			provider,
			bundler,
			paymaster,
			address: address as `0x${string}`,
			isConnected: true,
			loading: false
		}));
	} catch (error) {
		console.error(error);
		accountStore.update((state) => ({
			...state,
			error: 'Error fetching account details',
			loading: false
		}));
	}
}

// Function to handle disconnection
export async function disconnect(chainId: number) {
	const accountAbstractor = new BiconomyAccountAbstractor(chainId);
	await accountAbstractor.signOut();

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
		isConnected: false
	});
}

// we ported this from react so this is a compatability wrapper
export function useBiconomyAccountAbstraction(): Writable<SmartAccountStore> {
	return accountStore;
}
