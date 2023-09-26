import { ChainId } from '@biconomy/core-types';

export const APP_NAME = 'Ambos Finance';
export const WHAT_IS_AAVE = 'https://www.youtube.com/watch?v=dTCwssZ116A';
export const ROUTES = {
	DASHBOARD: '/dashboard',
	DASHBOARD_V2: '/dashboard-v2',
	WALLET: '/wallet-v2',
	WELCOME: '/welcome',
	MY_LOANS: '/loans',
	PROFILE: '/notifications',
	NOTIFICATIONS: '/notifications',
	LANDING_PAGE: '/',
	FAUCET: '/faucet',
	CALCULATOR: '/calculator',
	SEND_CRYPTO: '/wallet/send',
	HISTORY: '/profile/history',
	NEW_LOAN: '/loans/new',
	LOANS_V2: '/loans-v2',
	LOANS_V2_TRANSFER: '/loans-v2/transfer',
	LOANS_V2_REVIEW: '/loans-v2/review',
	LOANS_V2_CALCULATE: '/loans-v2/calculator'
} as const;

// dont show footer on these routes
export const EXCLUDED_FOOTER_ROUTES = [
	ROUTES.WELCOME,
	ROUTES.LOANS_V2_TRANSFER,
	ROUTES.LOANS_V2_REVIEW,
	ROUTES.LOANS_V2_CALCULATE
];

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
