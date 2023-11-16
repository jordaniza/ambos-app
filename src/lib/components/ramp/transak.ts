// @ts-ignore
import transakSDK from '@transak/transak-sdk';
import type { ITransakDto, environments } from './Interface';
import * as process from '$env/static/public';
import type { EthereumAddress } from '$lib/utils';
import { ChainId } from '@biconomy/core-types';

const apiKey = process.PUBLIC_TRANSAK_API_KEY;

function getEnv(): environments {
	const environment = process.PUBLIC_ENV;
	console.log('Transak::Environment set to', environment);
	if (environment === 'production') {
		return 'PRODUCTION';
	} else {
		return 'STAGING';
	}
}

const commonOptions = (): ITransakDto => ({
	apiKey,
	widgetHeight: '100%',
	widgetWidth: '100%',
	environment: getEnv()
});

const networkConfigOffRamp: Record<string, Partial<ITransakDto>> = {
	polygon: {
		defaultNetwork: 'polygon',
		defaultCryptoCurrency: 'USDC',
		cryptoCurrencyList: 'USDC',
		network: 'polygon'
	},
	arbitrum: {
		defaultNetwork: 'arbitrum',
		defaultCryptoCurrency: 'USDC',
		cryptoCurrencyList: 'USDC',
		network: 'arbitrum'
	},
	// broken at time of writing
	optimism: {
		network: 'optimism',
		cryptoCurrencyCode: 'USDC',
		cryptoCurrencyList: 'USDC'
	}
};

const networkConfigOnRamp: Record<string, Partial<ITransakDto>> = {
	polygon: {
		defaultNetwork: 'polygon',
		defaultCryptoCurrency: 'WETH',
		cryptoCurrencyList: 'ETH,WETH',
		networks: 'polygon'
	},
	arbitrum: {
		defaultNetwork: 'arbitrum',
		defaultCryptoCurrency: 'WETH',
		cryptoCurrencyList: 'ETH,WETH',
		networks: 'arbitrum'
	},
	optimism: {
		defaultNetwork: 'optimism',
		defaultCryptoCurrency: 'ETH',
		cryptoCurrencyList: 'ETH',
		networks: 'optimism'
	}
};

const objectToQueryString = (obj: Record<string, any>): string => {
	return Object.entries(obj)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');
};

export const getTransakURLOn = (
	chainId: ChainId,
	address: EthereumAddress,
	additionalOptions: Partial<ITransakDto> = {}
): string => {
	const baseURL = 'https://global.transak.com';
	const { apiKey, ...options } = optionsOn(getTransakNetwork(chainId), address);
	const qs = objectToQueryString({ ...options, ...additionalOptions });
	return `${baseURL}?${apiKey}&${qs}`;
};

export const getTransakURLOff = (
	chainId: ChainId,
	amount: number,
	additionalOptions: Partial<ITransakDto> = {}
): string => {
	const baseURL = 'https://global.transak.com';
	const { apiKey, ...options } = optionsOff(getTransakNetwork(chainId), amount);
	const qs = objectToQueryString({ ...options, ...additionalOptions });
	return `${baseURL}?${apiKey}&${qs}`;
};

/**
 * @dev you need to be careful with the SELL options. At time of writing
 * the SELL widget will silently hang if you pass unsupported parameters
 */
const optionsOff = (selectedNetwork: string, defaultCryptoAmount: number): ITransakDto => ({
	...commonOptions(),
	productsAvailed: 'SELL',
	cryptoCurrencyList: 'USDC',
	cryptoCurrencyCode: 'USDC',
	exchangeScreenTitle: 'Sell USDC',
	defaultCryptoAmount,
	...networkConfigOffRamp[selectedNetwork]
});

export const optionsOn = (
	selectedNetwork: string,
	walletAddress: EthereumAddress
): ITransakDto => ({
	...commonOptions(),
	...networkConfigOnRamp[selectedNetwork],
	walletAddress,
	exchangeScreenTitle: 'Buy ETH',
	productsAvailed: 'BUY'
});

export function initOnRamp(
	selectedNetwork: string,
	receiveAddress: EthereumAddress,
	optionsOverride: Partial<ITransakDto> = {}
) {
	const options = { ...optionsOn(selectedNetwork, receiveAddress), ...optionsOverride };
	const transak = new transakSDK(options);
	transak.init();
}

export function initOffRamp(
	selectedNetwork: string,
	defaultCryptoAmount: number,
	optionsOverride: Partial<ITransakDto> = {}
) {
	if (selectedNetwork === 'optimism') {
		console.error('optimism is not well supported by transak for SELL');
	}
	const options = { ...optionsOff(selectedNetwork, defaultCryptoAmount), ...optionsOverride };
	const transak = new transakSDK(options);
	transak.init();
}

export const getTransakNetwork = (chainId: ChainId | null): string => {
	if (!chainId) {
		throw new Error('No chainId provided to getTransakNetwork');
	}

	switch (chainId) {
		case ChainId.POLYGON_MUMBAI:
			return 'polygon';
		case ChainId.ARBITRUM_ONE_MAINNET:
		case ChainId.ARBITRUM_GOERLI_TESTNET:
			return 'arbitrum';
		default:
			throw new Error('Unsupported chainId for tranasak');
	}
};
