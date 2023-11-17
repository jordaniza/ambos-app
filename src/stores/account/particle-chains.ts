import type { ChainId } from '@biconomy/core-types';

export type ParticleChainNames = {
	[chainId in ChainId]: string;
};

// Particle chainNames mapped to biconomy supported chainIds
export const particleChainNames: Partial<ParticleChainNames> = {
	1: 'ethereum',
	5: 'ethereum',
	56: 'bsc',
	97: 'bsc',
	137: 'polygon',
	80001: 'polygon',
	43114: 'avalanche',
	43113: 'avalanche',
	42161: 'arbitrum',
	42170: 'arbitrum',
	421613: 'arbitrum',
	1284: 'moonbeam',
	10: 'optimism',
	420: 'optimism',
	1101: 'polygonzkevm',
	1442: 'polygonzkevm',
	8453: 'base',
	84531: 'base',
	59140: 'linea'
};

// oddities with exporting the enums from the particle chains at build stage
// so these are console logs of the values returned.
export const particleChains: Partial<Record<ChainId, any>> = {
	[421613]: {
		id: 421613,
		name: 'Arbitrum',
		chainType: 'evm',
		icon: 'https://static.particle.network/token-list/arbitrum/native.png',
		fullname: 'Arbitrum Goerli',
		network: 'Goerli',
		website: 'https://arbitrum.io',
		nativeCurrency: {
			name: 'Arbitrum Gorli Ether',
			symbol: 'AGOR',
			decimals: 18
		},
		rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
		faucetUrl: 'https://faucet.triangleplatform.com/arbitrum/goerli',
		blockExplorerUrl: 'https://goerli.arbiscan.io',
		features: [
			{
				name: 'EIP1559'
			}
		]
	},
	[42161]: {
		id: 42161,
		name: 'Arbitrum',
		chainType: 'evm',
		icon: 'https://static.particle.network/token-list/arbitrum/native.png',
		fullname: 'Arbitrum One',
		network: 'Mainnet',
		website: 'https://arbitrum.io',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18
		},
		rpcUrl: 'https://arb1.arbitrum.io/rpc',
		blockExplorerUrl: 'https://arbiscan.io',
		features: [
			{
				name: 'EIP1559'
			}
		]
	},
	[80001]: {
		id: 80001,
		name: 'Polygon',
		chainType: 'evm',
		icon: 'https://static.particle.network/token-list/polygon/native.png',
		fullname: 'Polygon Mumbai',
		network: 'Mumbai',
		website: 'https://polygon.technology',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18
		},
		rpcUrl: 'https://polygon-mumbai.gateway.tenderly.co',
		faucetUrl: 'https://faucet.polygon.technology',
		blockExplorerUrl: 'https://mumbai.polygonscan.com',
		features: [
			{
				name: 'EIP1559'
			}
		]
	}
};
