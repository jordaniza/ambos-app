import type { BigNumber, BigNumberish, ethers } from 'ethers';
import type { EthereumAddress } from './utils';
import { ChainId } from '@biconomy/core-types';

export const SupportedTokens = ['USDC', 'WETH', 'aWETH', 'wstETH', 'ETH'] as const;
export const SupportedContracts = [
	...SupportedTokens,
	'POOL',
	'ORACLE',
	'POOL_DATA_PROVIDER',
	'TESTNET_FAUCET',
	'SWAP_ROUTER'
] as const;

// TODO: swap tokens need to be phased into all parts of the application
export type TSupportedTokens = (typeof SupportedTokens)[number];
export type TSupportedContracts = (typeof SupportedContracts)[number];

export const SupportedSwapTokens = {
	out: {
		list: ['WBTC', 'WETH', 'LINK', 'UNI', 'AAVE', 'ARB', 'WMATIC'],
		default: 'WETH'
	},
	in: {
		list: ['USDC'],
		default: 'USDC'
	}
} as const;

export const ADDRESSES: Record<number | ChainId, Record<TSupportedContracts, EthereumAddress>> = {
	[ChainId.POLYGON_MUMBAI]: {
		// usdc minted in the aave pool
		USDC: '0x52d800ca262522580cebad275395ca6e7598c014',
		WETH: '0xc199807AF4fEDB02EE567Ed0FeB814A077de4802',
		POOL: '0xcC6114B983E4Ed2737E9BD3961c9924e6216c704',
		aWETH: '0xAba444af64ad33A6d8575b8A353226997d6A126a',
		ORACLE: '0x27848354d8c9f71a41c6f6edfC6E3CACf3b848c8',
		POOL_DATA_PROVIDER: '0x9e2DDb6aA91399546Bd875E2e63E8d6df276922e',
		TESTNET_FAUCET: '0x2c95d10bA4BBEc79e562e8B3f48687751808C925',
		// not supported
		wstETH: '0x',
		ETH: '0x',
		SWAP_ROUTER: '0x'
	},
	[ChainId.ARBITRUM_GOERLI_TESTNET]: {
		USDC: '0xd513e4537510c75e24f941f159b7cafa74e7b3b9',
		WETH: '0x4284186b053acdba28e8b26e99475d891533086a',
		POOL: '0x20fa38a4f8Af2E36f1Cc14caad2E603fbA5C535c',
		aWETH: '0x878092a3313bD2437ffbb6dC43638C0a1Cd0A8D2',
		ORACLE: '0x4C0EBa43c13ac25885fE0edf3E8Fd4fe32b528dE',
		POOL_DATA_PROVIDER: '0x7E4025a4e9Ae4e7EcA533cDFF1ba269eDD31146F',
		TESTNET_FAUCET: '0xc1b3cc37cf2f922abDFE7F01A17bc932F4078665',
		ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		// not supported
		wstETH: '0x',
		// mainnet swap router
		SWAP_ROUTER: '0xdef1c0ded9bec7f1a1670819833240f027b25eff'
	},
	[ChainId.ARBITRUM_ONE_MAINNET]: {
		USDC: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
		WETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
		POOL: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
		aWETH: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
		wstETH: '0x5979d7b546e38e414f7e9822514be443a4800529',
		ORACLE: '0xb56c2F0B653B2e0b10C9b928C8580Ac5Df02C7C7',
		POOL_DATA_PROVIDER: '0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654',
		ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		SWAP_ROUTER: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
		// not supported
		TESTNET_FAUCET: '0x'
	}
};

/**
 * Some additional contract addresses unique to testnet,
 * The mainnet addresses are the same as above but biconomy and aave
 * use different addresses for the paymaster and lending pools
 */
export const PAYMASTER_ADDRESSES: Record<number | ChainId, Record<string, EthereumAddress>> = {
	[ChainId.POLYGON_MUMBAI]: {
		// usdc used by the paymaster
		PAYMASTER_USDC: '0xda5289fcaaf71d52a80a254da614a192b693e977'
	},
	[ChainId.ARBITRUM_GOERLI_TESTNET]: {
		// usdc used by the paymaster
		PAYMASTER_USDC: '0x9ff2a6b0cdc4ab06bbe231327edfe493f130a994'
	},
	[ChainId.ARBITRUM_ONE_MAINNET]: {
		PAYMASTER_USDC: ADDRESSES[ChainId.ARBITRUM_ONE_MAINNET].USDC
	}
};

export type ERC20 = ethers.Contract & {
	balanceOf: (address: EthereumAddress) => Promise<BigNumber>;
	decimals: () => Promise<BigNumberish>;
};

export const BLOCK_EXPLORER_URLS: Record<number | ChainId, string> = {
	[ChainId.POLYGON_MUMBAI]: 'https://mumbai.polygonscan.com',
	[ChainId.ARBITRUM_GOERLI_TESTNET]: 'https://goerli.arbiscan.io',
	[ChainId.ARBITRUM_ONE_MAINNET]: 'https://arbiscan.io'
};

// which token to use for the chain, native or wrapped
export const CHAIN_ETH_TYPE: Record<number | ChainId, 'ETH' | 'WETH'> = {
	[ChainId.POLYGON_MUMBAI]: 'WETH',
	[ChainId.ARBITRUM_GOERLI_TESTNET]: 'ETH',
	[ChainId.ARBITRUM_ONE_MAINNET]: 'ETH'
};

// 0x API endpoints
export const SWAP_URL: Partial<Record<ChainId, string>> = {
	[ChainId.POLYGON_MUMBAI]: 'https://mumbai.api.0x.org',
	// we can't test swaps on goerli because the 0x api doesn't support it
	// and it adds a ton of extra complexity to the code to support it
	// so best to fork arbitrum mainnet and test there
	[ChainId.ARBITRUM_GOERLI_TESTNET]: 'https://arbitrum.api.0x.org',
	[ChainId.ARBITRUM_ONE_MAINNET]: 'https://arbitrum.api.0x.org'
};

// lists of tokens to use for the chain
export const TOKEN_LIST_URL: Partial<Record<ChainId, string>> = {
	[ChainId.POLYGON_MUMBAI]: 'https://tokens.coingecko.com/polygon-pos/all.json',
	[ChainId.ARBITRUM_ONE_MAINNET]: 'https://tokens.coingecko.com/arbitrum-one/all.json',
	// again, testing is difficult because
	// biconomy, aave and 0x use different test tokens. if you're testing swaps
	// use a fork
	[ChainId.ARBITRUM_GOERLI_TESTNET]: 'https://tokens.coingecko.com/arbitrum-one/all.json'
};
