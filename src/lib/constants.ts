import { ChainId } from '@biconomy/core-types';

export const APP_NAME = 'Ambos Finance';
export const WHAT_IS_AAVE = 'https://www.youtube.com/watch?v=dTCwssZ116A';
export const ROUTES = {
	ROOT: '',
	DASHBOARD_V2: '/dashboard',
	WALLET: '/wallet',
	WELCOME: '/welcome',
	PROFILE: '/notifications',
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
	WELCOME: 'seen_welcome'
};
