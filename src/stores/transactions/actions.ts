import { AavePool__factory, Faucet__factory, WETH__factory } from '$lib/abis/ts';
import type { EthereumAddress } from '$lib/utils';
import { getTokenAddress } from '$stores/web3/getBalances';
import type { BiconomySmartAccount } from '@biconomy/account';
import type { BigNumber, ethers } from 'ethers';
import { handleSponsoredTransaction, handleUserPaidTransaction, sponsoredTx } from './builder';
import { getAavePool, InterestRateMode } from '$stores/web3/getPoolData';
import { ADDRESSES } from '$lib/contracts';
import type { TxStore } from './state';
import type { SourceRouter } from '$lib/components/bridge';

export function approveWethSmartAccount(
	store: TxStore,
	addressToApprove: EthereumAddress,
	amount: BigNumber,
	provider: ethers.providers.Web3Provider,
	smartAccount: BiconomySmartAccount
) {
	return handleSponsoredTransaction(
		store,
		'APPROVE_WETH',
		provider,
		smartAccount,
		async (provider) => {
			const wethAddress = await getTokenAddress(provider, 'WETH');
			const weth = WETH__factory.connect(wethAddress, provider);
			const approveTx = await weth.populateTransaction.approve(addressToApprove, amount);
			return { contractAddress: wethAddress, data: approveTx.data };
		}
	);
}

export function sendWethSmartAccount(
	store: TxStore,
	addressTo: EthereumAddress,
	amount: BigNumber,
	provider: ethers.providers.Web3Provider,
	smartAccount: BiconomySmartAccount
) {
	return handleSponsoredTransaction(
		store,
		'SEND_WETH',
		provider,
		smartAccount,
		async (provider) => {
			const wethAddress = await getTokenAddress(provider, 'WETH');
			const weth = WETH__factory.connect(wethAddress, provider);
			const transferTx = await weth.populateTransaction.transfer(addressTo, amount);
			return { contractAddress: wethAddress, data: transferTx.data };
		}
	);
}

export function supplyWethToAavePool(
	store: TxStore,
	amount: ethers.BigNumber,
	onBehalfOf: EthereumAddress,
	provider: ethers.providers.Web3Provider,
	smartAccount: BiconomySmartAccount
) {
	return handleSponsoredTransaction(
		store,
		'SUPPLY_WETH',
		provider,
		smartAccount,
		async (provider) => {
			const poolAddress = await getAavePool(provider);
			const pool = AavePool__factory.connect(poolAddress, provider);
			const wethAddress = await getTokenAddress(provider, 'WETH');
			const tx = await pool.populateTransaction.supply(wethAddress, amount, onBehalfOf, 0);
			return { contractAddress: poolAddress, data: tx.data };
		}
	);
}

export function borrowUsdcFromAavePool(
	store: TxStore,
	amount: ethers.BigNumber,
	borrower: EthereumAddress,
	provider: ethers.providers.Web3Provider,
	smartAccount: BiconomySmartAccount,
	interestRateMode: InterestRateMode
) {
	return handleSponsoredTransaction(
		store,
		'BORROW_USDC',
		provider,
		smartAccount,
		async (provider) => {
			const poolAddress = await getAavePool(provider);
			const pool = AavePool__factory.connect(poolAddress, provider);
			const usdcAddress = await getTokenAddress(provider, 'USDC');
			const tx = await pool.populateTransaction.borrow(
				usdcAddress,
				amount,
				interestRateMode,
				0,
				borrower
			);
			return { contractAddress: poolAddress, data: tx.data };
		}
	);
}

export function requestWETHFromTestnetFaucet(
	store: TxStore,
	amount: ethers.BigNumber,
	provider: ethers.providers.Web3Provider,
	recipient: EthereumAddress,
	smartAccount: BiconomySmartAccount
) {
	return handleSponsoredTransaction(
		store,
		'REQUEST_WETH_FROM_FAUCET',
		provider,
		smartAccount,
		async (provider) => {
			const { chainId } = await provider.getNetwork();
			const wethAddress = ADDRESSES[chainId]['WETH'];
			const faucetAddress = ADDRESSES[chainId]['TESTNET_FAUCET'];
			const faucet = Faucet__factory.connect(faucetAddress, provider);
			const tx = await faucet.populateTransaction.mint(wethAddress, recipient, amount);
			return { contractAddress: faucetAddress, data: tx.data };
		}
	);
}

export function sendWETH(
	store: TxStore,
	amount: ethers.BigNumber,
	recipient: EthereumAddress,
	provider: ethers.providers.Web3Provider,
	smartAccount: BiconomySmartAccount
) {
	return handleSponsoredTransaction(
		store,
		'SEND_WETH',
		provider,
		smartAccount,
		async (provider) => {
			const wethAddress = await getTokenAddress(provider, 'WETH');
			const weth = WETH__factory.connect(wethAddress, provider);
			const tx = await weth.populateTransaction.transfer(recipient, amount);
			return { contractAddress: wethAddress, data: tx.data };
		}
	);
}

export function sendUSDC(
	store: TxStore,
	amount: ethers.BigNumber,
	recipient: EthereumAddress,
	provider: ethers.providers.Web3Provider,
	smartAccount: BiconomySmartAccount
) {
	return handleSponsoredTransaction(
		store,
		'SEND_USDC',
		provider,
		smartAccount,
		async (provider) => {
			const usdcAddress = await getTokenAddress(provider, 'USDC');
			const usdc = WETH__factory.connect(usdcAddress, provider);
			const tx = await usdc.populateTransaction.transfer(recipient, amount);
			return { contractAddress: usdcAddress, data: tx.data };
		}
	);
}

export function bridgeETH({
	store,
	amount,
	sourceRouter,
	dstChainId,
	fromAddress,
	toAddress,
	minAmount
}: {
	store: TxStore;
	amount: ethers.BigNumber;
	sourceRouter: SourceRouter;
	dstChainId: number;
	fromAddress: EthereumAddress;
	toAddress: EthereumAddress;
	minAmount: ethers.BigNumber;
}) {
	if (!sourceRouter.signer) sourceRouter.setSigner();
	return handleUserPaidTransaction(store, 'BRIDGE_ETH', sourceRouter.signer!, async () => {
		const tx = await sourceRouter.stargateSwapETH(
			dstChainId,
			fromAddress,
			toAddress,
			amount,
			minAmount
		);
		return { tx };
	});
}
