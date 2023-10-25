import { ChainId } from '@biconomy/core-types';
import type { EthereumAddress } from './utils';

export const MAX_BORROW_PERCENTAGE = 50;
export const AMBOS_BORROW_FEE_PERCENT = 1;

export const APP_NAME = 'Ambos Finance';
export const DISCOVER_AMBOS = 'https://docs.ambos.finance';
export const WHAT_IS_AAVE = 'https://www.youtube.com/watch?v=dTCwssZ116A';
export const AMBOS_FAQ = 'https://docs.ambos.finance/faqs/frequently-asked-questions';
export const AFFILIATE_LINK = 'https://docs.ambos.finance/affiliates';
export const EXCHANGE_GUIDE = 'https://docs.ambos.finance/exchanges';
export const NETWORKS_AND_BRIDGING = 'https://docs.ambos.finance/faqs/networks-and-bridging';

export const DEFAULT_BLOCK_CONFIRMATIONS = 3;

export const ROUTES = {
	ROOT: '',
	DASHBOARD_V2: '/dashboard',
	WALLET: '/wallet',
	WELCOME: '/welcome',
	PROFILE: '/profile',
	NOTIFICATIONS: '/notifications',
	LANDING_PAGE: '/',
	FAUCET: '/faucet',
	CALCULATOR: '/calculator',
	SEND_CRYPTO: '/wallet/send',
	HISTORY: '/profile/history',
	LOANS_V2: '/loans',
	LOANS_V2_TRANSFER: '/loans/transfer',
	LOANS_V2_REVIEW: '/loans/review',
	LOANS_V2_CALCULATE: '/loans/calculator',
	LOANS_V2_BANK_TRANSFER: '/loans/bank-transfer',
	DOWNLOAD: '/download'
} as const;

// dont show footer on these routes
export const EXCLUDED_FOOTER_ROUTES = [
	ROUTES.WELCOME,
	ROUTES.LOANS_V2_TRANSFER,
	ROUTES.LOANS_V2_REVIEW,
	ROUTES.LOANS_V2_CALCULATE,
	ROUTES.DOWNLOAD
];

export const EXCLUDED_SPLASH_ROUTES = [ROUTES.WELCOME, ROUTES.DOWNLOAD, ROUTES.ROOT];

type BG = {
	[key in keyof typeof ROUTES]?: string;
};

// background images for each route
export const BACKGROUNDS: BG = {
	CALCULATOR: '/backgrounds/calculator.png',
	DASHBOARD_V2: '/backgrounds/home.png',
	WALLET: '/backgrounds/wallet.png',
	LOANS_V2: '/backgrounds/loans.png',
	LOANS_V2_CALCULATE: '/backgrounds/new-loan.png',
	LOANS_V2_REVIEW: '/backgrounds/new-loan.png',
	LOANS_V2_TRANSFER: '/backgrounds/new-loan.png',
	NOTIFICATIONS: '/backgrounds/notifications.png'
};

/**
 * https://docs.aave.com/developers/core-contracts/aaveoracle#getassetprice
 * All V3 markets use USD based oracles which return values with 8 decimals.
 */
export const BASE_CURRENCY_DECIMALS = 8;
export const LTV_DECIMALS = 4;
/// rates are returned with 27 decimals
export const RAY_DECIMALS = 27;

export const IS_TESTNET: { [key in ChainId]?: boolean } = {
	[ChainId.POLYGON_MUMBAI]: true
};

export const LOCAL_STORAGE_KEYS = {
	// whether the user has seen the welcome screen
	WELCOME: 'seen_welcome',
	WELCOME_DIALOG: 'seen_welcome_dialog',
	// this will be combine with the user's ethereum address
	// in the format of `${LOCAL_STORAGE_KEYS.TRANSACTIONS}_${address}`
	TRANSACTIONS: 'transactions',
	// eth price data
	CACHED_CHART_DATA: 'cachedChartData',
	// fee estimations
	CACHED_FEE_DATA_GET_LOAN: 'cachedFeeDataGetLoan',
	CACHED_FEE_DATA_TRANSFER: 'cachedFeeDataTransfer'
};

export const getUserStorageKey = (address: EthereumAddress) =>
	`${LOCAL_STORAGE_KEYS.TRANSACTIONS}_${address}`;
