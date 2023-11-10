import { BigNumber, ethers } from 'ethers';
import type { EthereumAddress } from '$lib/utils';
import { ADDRESSES, type ERC20, SupportedTokens, type TSupportedTokens } from '$lib/contracts';
import { handleError, type Web3Store, type web3Store } from '.';
import { get } from 'svelte/store';
import { USDC__factory, WETH__factory } from '$lib/abis/ts';
import type { AppProvider } from '$stores/account';

export type Options = {
	watch?: boolean;
	interval?: number;
};

export const getTokenAddress = async (provider: AppProvider, token: TSupportedTokens) => {
	const { chainId } = await provider.getNetwork();
	const tokenAddress = ADDRESSES[chainId][token];
	if (!tokenAddress) {
		throw new Error(`Token ${token} not supported on chain ${chainId}`);
	}
	return tokenAddress;
};

export const shouldUpdateBalance = (newVal: BigNumber | null, prevVal: string | null): boolean => {
	if (!newVal) return false;
	if (!prevVal) return true;
	return !newVal.eq(prevVal);
};

const getBalanceAndDecimals = async (
	token: ERC20,
	existingDecimals: number | null,
	address: EthereumAddress
): Promise<[BigNumber, number]> => {
	const balance = await token.balanceOf(address);
	const decimals = existingDecimals ?? (await token.decimals());
	return [balance, Number(decimals)];
};

function setTokenBalance(
	id: TSupportedTokens,
	store: typeof web3Store,
	balance: BigNumber,
	blockNumber: number,
	decimals: number
) {
	store.update((s) => {
		// If the balance hasn't changed, don't update the store
		const prevBalance = s.balances[id].big;
		if (!shouldUpdateBalance(balance, prevBalance)) {
			return s;
		}
		// Update the store
		s.balances[id].lastUpdatedBlock = blockNumber;
		s.balances[id].decimals = decimals;
		s.balances[id].big = balance.toString();
		s.balances[id].small = parseFloat(ethers.utils.formatUnits(balance, decimals));
		return s;
	});
}

export async function getSetTokenBalance(
	token: ERC20,
	tokenName: string,
	userAddress: EthereumAddress,
	store: typeof web3Store,
	blockNumber: number
): Promise<void> {
	const currentStore = get<Web3Store>(store);
	if (!SupportedTokens.includes(tokenName as TSupportedTokens)) {
		throw new Error(`Token ${tokenName} not supported`);
	}
	const supportedTokenName = tokenName as TSupportedTokens;
	try {
		let [balance, decimals] = await getBalanceAndDecimals(
			token,
			currentStore.balances[supportedTokenName].decimals,
			userAddress
		);
		setTokenBalance(supportedTokenName, store, balance, blockNumber, decimals);
	} catch (e) {
		handleError(store, e as Error, 'setTokenBalance error');
	}
}

async function getSupportedTokenContracts(
	provider: AppProvider
): Promise<[ERC20, TSupportedTokens][]> {
	const chainId = (await provider.getNetwork()).chainId;
	const usdc = USDC__factory.connect(ADDRESSES[chainId]['USDC'], provider);
	const weth = WETH__factory.connect(ADDRESSES[chainId]['WETH'], provider);
	const aweth = WETH__factory.connect(ADDRESSES[chainId]['aWETH'], provider);
	return [
		[usdc, 'USDC'],
		[weth, 'WETH'],
		[aweth, 'aWETH']
	] as [ERC20, TSupportedTokens][];
}

export async function getSetSupportedTokenBalances(
	userAddress: EthereumAddress,
	provider: AppProvider,
	store: typeof web3Store
): Promise<void> {
	debugger;
	const tokens = await getSupportedTokenContracts(provider);
	tokens.forEach(([token, name]) => {
		getSetTokenBalance(token, name, userAddress, store, 0);
	});
}

export async function watchTokenBalance(
	token: ERC20,
	tokenName: string,
	userAddress: EthereumAddress,
	store: typeof web3Store,
	interval: number
): Promise<void> {
	const currentBlock = await token.provider.getBlockNumber();
	await getSetTokenBalance(token, tokenName, userAddress, store, currentBlock);
	token.provider.on('block', async (blockNumber) => {
		if (blockNumber % interval === 0) {
			await getSetTokenBalance(token, tokenName, userAddress, store, blockNumber);
		}
	});
}

export async function watchSupportedTokenBalances(
	userAddress: EthereumAddress,
	provider: AppProvider,
	store: typeof web3Store,
	interval: number
): Promise<void> {
	const tokens = await getSupportedTokenContracts(provider);
	tokens.forEach(([token, name]) => {
		watchTokenBalance(token, name, userAddress, store, interval);
	});
}
