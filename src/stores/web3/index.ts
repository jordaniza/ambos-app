import { SupportedTokens, type TSupportedTokens } from '$lib/contracts';
import { writable } from 'svelte/store';
import type { PoolReserveData, UserAccountData } from './getPoolData';
import type { ChainId } from '@biconomy/core-types';

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
