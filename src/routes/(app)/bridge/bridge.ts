import { ethers } from 'ethers';
import * as process from '$env/static/public';
import type { ChainId } from '@biconomy/core-types';

// todo: abstract out infura for any node vendor

export const INFURA_TEST_NETWORKS = [
	{ name: 'polygon-mumbai', chainId: 80001 },
	{ name: 'optimism-goerli', chainId: 420 },
	{ name: 'arbitrum-goerli', chainId: 421613 },
	{ name: 'avalanche-fuji', chainId: 43113 },
	{ name: 'goerli', chainId: 5 }
] as const;

export type InfuraNetwork = (typeof INFURA_TEST_NETWORKS)[number];
export const TARGET_CHAIN_ID: InfuraNetwork['chainId'] = 420;

export type NetworkBalance = {
	chainId: ChainId;
	balance: {
		big: ethers.BigNumber;
		small: string;
	};
};

export type ProviderByChain = {
	network: InfuraNetwork['name'];
	chainId: ChainId;
	provider: ethers.providers.JsonRpcProvider;
};

export const infuraRPC = (networkName: InfuraNetwork['name']) => {
	const INFURA_ID = process.PUBLIC_INFURA_ID;
	if (!INFURA_ID) {
		throw new Error('INFURA_ID not set');
	}
	return `https://${networkName}.infura.io/v3/${INFURA_ID}`;
};

// creates a simple provider for each network
export const initProviderForChain = (network: InfuraNetwork): ProviderByChain => ({
	network: network.name,
	chainId: network.chainId,
	provider: new ethers.providers.JsonRpcProvider(infuraRPC(network.name))
});

export const initProvidersForChains = (): ProviderByChain[] =>
	INFURA_TEST_NETWORKS.map(initProviderForChain);

export function getName(chainId: ChainId): InfuraNetwork['name'] {
	const network = INFURA_TEST_NETWORKS.find((n) => n.chainId === chainId);
	if (!network) {
		throw new Error(`No network found for chainId ${chainId}`);
	}
	return network.name;
}

export const fetchOnChainBalances = async (address: string, providers: ProviderByChain[]) => {
	const balances = await Promise.all(
		providers.map(async ({ chainId, provider }) => {
			const balanceResult = await provider.getBalance(address);
			const balance = {
				big: balanceResult,
				small: ethers.utils.formatEther(balanceResult)
			};
			return { chainId, balance };
		})
	);
	return balances;
};
