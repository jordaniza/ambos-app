import { ChainId } from '@biconomy/core-types';

export const APP_NAME = 'Ambos Finance';
export const WHAT_IS_AAVE = 'https://www.youtube.com/watch?v=dTCwssZ116A';
export const ROUTES = {
	DASHBOARD: '/dashboard',
	WALLET: '/wallet',
	MY_LOANS: '/loans',
	PROFILE: '/profile',
	LANDING_PAGE: '/',
	FAUCET: '/faucet',
	// fallback
	NEW_LOAN: '/loans/new'
};

// child routes require instantiation
ROUTES.NEW_LOAN = `${ROUTES.MY_LOANS}/new`;

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
