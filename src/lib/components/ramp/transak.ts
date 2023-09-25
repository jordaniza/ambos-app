// @ts-ignore
import transakSDK from '@transak/transak-sdk';
import type { ITransakDto } from './Interface';
import * as process from '$env/static/public';
import type { EthereumAddress } from '$lib/utils';
import { ChainId } from '@biconomy/core-types';

const apiKey = process.PUBLIC_TRANSAK_API_KEY;
console.warn('TRANSAK IS SET TO STAGING');
const commonOptions: ITransakDto = {
	apiKey,
	widgetHeight: '100%',
	widgetWidth: '100%',
	environment: 'STAGING'
};

const networkConfigOffRamp: Record<string, Partial<ITransakDto>> = {
	polygon: {
		defaultNetwork: 'polygon',
		defaultCryptoCurrency: 'USDC',
		cryptoCurrencyList: 'USDC',
		network: 'polygon'
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

export const getTransakURLOn = (chainId: ChainId, address: EthereumAddress): string => {
	const baseURL = 'https://global.transak.com';
	const { apiKey, ...options } = optionsOn(getTransakNetwork(chainId), address);
	const qs = objectToQueryString(options);
	return `${baseURL}?${apiKey}&${qs}`;
};

/**
 * @dev you need to be careful with the SELL options. At time of writing
 * the SELL widget will silently hang if you pass unsupported parameters
 */
const optionsOff = (selectedNetwork: string, defaultCryptoAmount: number): ITransakDto => ({
	...commonOptions,
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
	...commonOptions,
	...networkConfigOnRamp[selectedNetwork],
	walletAddress,
	// exchangeScreenTitle: 'Buy ETH',
	productsAvailed: 'BUY'
});

export function initOnRamp(
	selectedNetwork: string,
	receiveAddress: EthereumAddress,
	optionsOverride: Partial<ITransakDto> = {}
) {
	const options = { ...optionsOn(selectedNetwork, receiveAddress), ...optionsOverride };
	console.log({ options });
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
	if (!chainId || (chainId !== ChainId.POLYGON_MUMBAI && chainId)) {
		throw new Error('Unsupported chainId for tranasak');
	}
	// need to add new chains as they are supported
	return 'polygon';
};
