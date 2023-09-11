// @ts-ignore
import transakSDK from '@transak/transak-sdk';
import type { ITransakDto } from './Interface';
import * as process from '$env/static/public';
import type { EthereumAddress } from '$lib/utils';
import { ChainId } from '@biconomy/core-types';

const apiKey = process.PUBLIC_TRANSAK_API_KEY;
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

const optionsOn = (selectedNetwork: string, walletAddress: EthereumAddress): ITransakDto => ({
	...commonOptions,
	...networkConfigOnRamp[selectedNetwork],
	walletAddress,
	exchangeScreenTitle: 'Buy ETH',
	productsAvailed: 'BUY'
});

export function initOnRamp(selectedNetwork: string, receiveAddress: EthereumAddress) {
	const options = optionsOn(selectedNetwork, receiveAddress);
	const transak = new transakSDK(options);
	transak.init();
}

export function initOffRamp(selectedNetwork: string, defaultCryptoAmount: number) {
	if (selectedNetwork === 'optimism') {
		console.error('optimism is not well supported by transak for SELL');
	}
	const options = optionsOff(selectedNetwork, defaultCryptoAmount);
	const transak = new transakSDK(options);
	transak.init();
}

export const getTransakNetwork = (chainId: ChainId | null): string | undefined => {
	if (!chainId) return;
	if (chainId !== ChainId.POLYGON_MUMBAI && chainId) {
		throw new Error('Unsupported chainId for tranasak');
	}
	// need to add new chains as they are supported
	return 'polygon';
};
