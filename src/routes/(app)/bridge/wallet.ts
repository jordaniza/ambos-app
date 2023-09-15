import Onboard from '@web3-onboard/core';
import injectedWalletsModule from '@web3-onboard/injected-wallets';
import walletConnectModule, { type WalletConnectOptions } from '@web3-onboard/walletconnect';
import { infuraRPC } from './bridge';

const injected = injectedWalletsModule();
const wcOptions: WalletConnectOptions = {
	connectFirstChainId: true,
	projectId: 'c0a040e0-0a0a-4c0a-8a0a-0a0a0a0a0a0a'
};
const walletConnect = walletConnectModule(wcOptions);
const wallets = [injected, walletConnect];

const getChains = () => [
	{
		id: 5,
		token: 'ETH',
		label: 'Ethereum Goerli',
		rpcUrl: infuraRPC('goerli')
	},
	{
		id: 420,
		token: 'ETH',
		label: 'Optimism Goerli',
		rpcUrl: infuraRPC('optimism-goerli')
	},
	{
		id: 421613,
		token: 'ETH',
		label: 'Arbitrum Goerli',
		rpcUrl: infuraRPC('arbitrum-goerli')
	}
];

const appMetadata = {
	name: 'Ambos Finance',
	icon: '<svg />',
	logo: '<svg />',
	description: 'Ambos Finance Wallet Connection',
	recommendedInjectedWallets: [
		{ name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
		{ name: 'MetaMask', url: 'https://metamask.io' }
	]
};

export function setupWallet(options?: WalletConnectOptions) {
	const wallet = Onboard({
		wallets,
		chains: getChains(),
		appMetadata,
		connect: {
			autoConnectLastWallet: true
		},
		...options
	});

	return wallet;
}
