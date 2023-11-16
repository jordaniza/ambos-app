import { AavePool__factory, Faucet__factory, USDC__factory, WETH__factory } from '$lib/abis/ts';
import type { EthereumAddress } from '$lib/utils';
import { getTokenAddress } from '$stores/web3/getBalances';
import type { BiconomySmartAccount } from '@biconomy/account';
import { ethers, type BigNumber } from 'ethers';
import {
	setNewTransaction,
	updateTransaction,
	type TxStore,
	type UUID,
	type SupportedSingleTransaction,
	type TxContext
} from './state';
import { batchSponsoredTx, sponsoredTx } from './sponsored';
import { getAavePool, InterestRateMode } from '$stores/web3/getPoolData';
import { ADDRESSES } from '$lib/contracts';
import type { AppProvider } from '$stores/account';
import { getFeeCollector } from './batchActions';
import { getTransferFeeQuote, getTransferFeeQuoteEth } from './fees';

/**
 * Basic handler for sponsored transactions
 * @param store pass in the current instance of the svelte store
 * @param transactionType must be a registered/supported action
 * @param provider the web3 provider
 * @param smartAccount the smart account instance required for sponsorship
 * @param transactionBuilder callback to contain the logic for building the transaction
 */
async function handleSponsoredTransaction(
	store: TxStore,
	transactionType: SupportedSingleTransaction,
	provider: AppProvider,
	smartAccount: BiconomySmartAccount,
	id: string,
	transactionBuilder: (
		provider: AppProvider,
		id: UUID
	) => Promise<{ to: EthereumAddress; data: any }[]>,
	context?: TxContext[keyof TxContext]
): Promise<void> {
	setNewTransaction(store, transactionType, id, context);
	const transactions = await transactionBuilder(provider, id);
	updateTransaction(store, id, {
		state: 'SIGNING'
	});
	await batchSponsoredTx(store, id, transactions, smartAccount);
}

type ApproveWethSmartAccountProps = {
	store: TxStore;
	addressToApprove: EthereumAddress;
	amount: BigNumber;
	provider: AppProvider;
	smartAccount: BiconomySmartAccount;
	id: string;
};
export function approveWethSmartAccount({
	store,
	addressToApprove,
	amount,
	provider,
	smartAccount,
	id
}: ApproveWethSmartAccountProps) {
	return handleSponsoredTransaction(
		store,
		'APPROVE_WETH',
		provider,
		smartAccount,
		id,
		async (provider) => {
			const wethAddress = await getTokenAddress(provider, 'WETH');
			const weth = WETH__factory.connect(wethAddress, provider);
			const approveTx = await weth.populateTransaction.approve(addressToApprove, amount);
			return [{ to: wethAddress, data: approveTx.data }];
		}
	);
}

type SendWethSmartAccountProps = {
	store: TxStore;
	addressTo: EthereumAddress;
	amount: BigNumber;
	provider: AppProvider;
	smartAccount: BiconomySmartAccount;
	id: string;
};
export function sendWethSmartAccount({
	store,
	addressTo,
	amount,
	provider,
	smartAccount,
	id
}: SendWethSmartAccountProps) {
	return handleSponsoredTransaction(
		store,
		'SEND_WETH',
		provider,
		smartAccount,
		id,
		async (provider) => {
			const wethAddress = await getTokenAddress(provider, 'WETH');
			const weth = WETH__factory.connect(wethAddress, provider);
			const transferTx = await weth.populateTransaction.transfer(addressTo, amount);
			return [{ to: wethAddress, data: transferTx.data }];
		}
	);
}

type SupplyWethToAavePoolProps = {
	store: TxStore;
	amount: BigNumber;
	onBehalfOf: EthereumAddress;
	provider: AppProvider;
	smartAccount: BiconomySmartAccount;
	id: string;
};
export function supplyWethToAavePool({
	store,
	amount,
	onBehalfOf,
	provider,
	smartAccount,
	id
}: SupplyWethToAavePoolProps) {
	return handleSponsoredTransaction(
		store,
		'SUPPLY_WETH',
		provider,
		smartAccount,
		id,
		async (provider) => {
			const poolAddress = await getAavePool(provider);
			const pool = AavePool__factory.connect(poolAddress, provider);
			const wethAddress = await getTokenAddress(provider, 'WETH');
			const tx = await pool.populateTransaction.supply(wethAddress, amount, onBehalfOf, 0);
			return [{ to: poolAddress, data: tx.data }];
		}
	);
}

type BorrowUsdcFromAavePoolProps = {
	store: TxStore;
	amount: BigNumber;
	borrower: EthereumAddress;
	provider: AppProvider;
	smartAccount: BiconomySmartAccount;
	interestRateMode: InterestRateMode;
	id: string;
};
export function borrowUsdcFromAavePool({
	store,
	amount,
	borrower,
	provider,
	smartAccount,
	interestRateMode,
	id
}: BorrowUsdcFromAavePoolProps) {
	return handleSponsoredTransaction(
		store,
		'BORROW_USDC',
		provider,
		smartAccount,
		id,
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
			return [{ to: poolAddress, data: tx.data }];
		}
	);
}

type RequestWETHFromTestnetFaucetProps = {
	store: TxStore;
	amount: BigNumber;
	recipient: EthereumAddress;
	provider: AppProvider;
	smartAccount: BiconomySmartAccount;
	id: string;
};
export function requestWETHFromTestnetFaucet({
	store,
	amount,
	recipient,
	provider,
	smartAccount,
	id
}: RequestWETHFromTestnetFaucetProps) {
	return handleSponsoredTransaction(
		store,
		'REQUEST_WETH_FROM_FAUCET',
		provider,
		smartAccount,
		id,
		async (provider) => {
			const { chainId } = await provider.getNetwork();
			const wethAddress = ADDRESSES[chainId]['WETH'];
			const faucetAddress = ADDRESSES[chainId]['TESTNET_FAUCET'];
			const faucet = Faucet__factory.connect(faucetAddress, provider);
			const tx = await faucet.populateTransaction.mint(wethAddress, recipient, amount);
			return [{ to: faucetAddress, data: tx.data }];
		}
	);
}

type SendWETHProps = {
	store: TxStore;
	amount: BigNumber;
	recipient: EthereumAddress;
	provider: AppProvider;
	smartAccount: BiconomySmartAccount;
	id: string;
};
export function sendWETH({ store, amount, recipient, provider, smartAccount, id }: SendWETHProps) {
	const context: TxContext['TRANSFER'] = {
		amount: Number(ethers.utils.formatUnits(amount, 18)),
		recipient,
		token: 'WETH'
	};

	return handleSponsoredTransaction(
		store,
		'SEND_WETH',
		provider,
		smartAccount,
		id,
		async (provider) => {
			const feeCollector = getFeeCollector();
			const fee = await getTransferFeeQuoteEth({
				smartAccount,
				provider,
				transferQty: amount,
				token: 'WETH',
				recipient
			});
			const wethAddress = await getTokenAddress(provider, 'WETH');
			const weth = WETH__factory.connect(wethAddress, provider);
			const tx0 = await weth.populateTransaction.transfer(recipient, amount);
			const tx1 = await weth.populateTransaction.transfer(feeCollector, fee.big);
			return [
				{
					to: wethAddress,
					data: tx0.data
				},
				{
					to: wethAddress,
					data: tx1.data
				}
			];
		},
		context
	);
}

type SendUSDCProps = {
	store: TxStore;
	amount: BigNumber;
	recipient: EthereumAddress;
	provider: AppProvider;
	smartAccount: BiconomySmartAccount;
	id: string;
};
export function sendUSDC({ store, amount, recipient, provider, smartAccount, id }: SendUSDCProps) {
	const context: TxContext['TRANSFER'] = {
		amount: Number(ethers.utils.formatUnits(amount, 6)),
		recipient,
		token: 'USDC'
	};

	return handleSponsoredTransaction(
		store,
		'SEND_USDC',
		provider,
		smartAccount,
		id,
		async (provider) => {
			const feeCollector = getFeeCollector();
			const fee = await getTransferFeeQuote({
				smartAccount,
				provider,
				transferQty: amount,
				token: 'USDC',
				recipient
			});
			const usdcAddress = await getTokenAddress(provider, 'USDC');
			const usdc = USDC__factory.connect(usdcAddress, provider);
			const tx0 = await usdc.populateTransaction.transfer(recipient, amount);
			const tx1 = await usdc.populateTransaction.transfer(feeCollector, fee.big);
			return [
				{
					to: usdcAddress,
					data: tx0.data
				},
				{
					to: usdcAddress,
					data: tx1.data
				}
			];
		},
		context
	);
}
