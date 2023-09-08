import { ADDRESSES, SupportedTokens, type TSupportedTokens } from '$lib/contracts';
import { writable } from 'svelte/store';
import type { ChainId } from '@biconomy/core-types';
import { getSetPoolData, watchPoolData } from './getPoolData';
import { getSetSupportedTokenBalances, watchSupportedTokenBalances } from './getBalances';
import { getSetEthPrice, watchEthPrice } from './getPrices';
import type { ethers } from 'ethers';
import type { EthereumAddress } from '$lib/utils';

type TokenBalance = {
	big: string | null;
	small: number | null;
	decimals: number | null;
	lastUpdatedBlock: number | null;
};

type LoanDataItem = Omit<TokenBalance, 'lastUpdatedBlock'>;

const defaultLoanDataItem: LoanDataItem = {
	big: null,
	small: null,
	decimals: null
};

type EthPrice = {
	big: string | null;
	small: number | null;
	// aave oracle usually defaults to 8 decimals
	decimals: number | null;
	lastUpdatedBlock: number | null;
};

type StoreTokenBalances = {
	[T in TSupportedTokens]: TokenBalance;
};

export type UserLoanData = {
	totalCollateralBase: LoanDataItem;
	totalDebtBase: LoanDataItem;
	availableBorrowBase: LoanDataItem;
	currentLiquidationThreshold: LoanDataItem;
	ltv: LoanDataItem;
	healthFactor: LoanDataItem;
	lastUpdatedBlock: number | null;
};

export type PoolLoanData = {
	ltv: LoanDataItem;
	stableBorrowingEnabled: boolean;
	variableBorrowingRate: LoanDataItem;
	stableBorrowingRate: LoanDataItem;
	lastUpdatedBlock: number | null;
};

const defaultPoolLoanData: PoolLoanData = {
	ltv: defaultLoanDataItem,
	stableBorrowingEnabled: false,
	variableBorrowingRate: defaultLoanDataItem,
	stableBorrowingRate: defaultLoanDataItem,
	lastUpdatedBlock: null
};

const defaultUserLoanData: UserLoanData = {
	totalCollateralBase: defaultLoanDataItem,
	totalDebtBase: defaultLoanDataItem,
	availableBorrowBase: defaultLoanDataItem,
	currentLiquidationThreshold: defaultLoanDataItem,
	ltv: defaultLoanDataItem,
	healthFactor: defaultLoanDataItem,
	lastUpdatedBlock: null
};

export type Web3Store = {
	balances: StoreTokenBalances;
	ethPrice: EthPrice;
	userPoolData: UserLoanData;
	poolReserveData: PoolLoanData;
	chainId: ChainId | null;
	isTestnet: boolean;
};

const DEFAULT_STORE: Web3Store = {
	chainId: null,
	isTestnet: false,
	ethPrice: {
		big: null,
		small: null,
		decimals: null,
		lastUpdatedBlock: null
	},
	userPoolData: defaultUserLoanData,
	poolReserveData: defaultPoolLoanData,
	balances: SupportedTokens.reduce((acc, token) => {
		acc[token] = {
			big: null,
			small: null,
			decimals: null,
			lastUpdatedBlock: null
		};
		return acc;
	}, {} as StoreTokenBalances)
};

export const web3Store = writable(DEFAULT_STORE);

export function watchW3Store(
	userAddress: EthereumAddress,
	provider: ethers.providers.Web3Provider,
	store: typeof web3Store,
	blockInterval: number = 30
) {
	watchSupportedTokenBalances(userAddress, provider, store, blockInterval);
	watchEthPrice(provider, store, blockInterval);
	watchPoolData(userAddress, provider, store, blockInterval);
}

export async function refreshW3Store(
	userAddress: EthereumAddress,
	provider: ethers.providers.Web3Provider,
	store: typeof web3Store
) {
	const chainId = (await provider.getNetwork()).chainId;
	const reserveTokenAddress = ADDRESSES[chainId]['WETH'];
	const currentBlock = await provider.getBlockNumber();
	await Promise.all([
		getSetSupportedTokenBalances(userAddress, provider, store),
		getSetEthPrice(provider, store, currentBlock),
		getSetPoolData(userAddress, reserveTokenAddress, provider, store, currentBlock)
	]);
}
