import { AavePool__factory, Faucet__factory, USDC__factory, WETH__factory } from '$lib/abis/ts';
import type { EthereumAddress } from '$lib/utils';
import { getTokenAddress } from '$stores/web3/getBalances';
import type { BiconomySmartAccountV2 } from '@biconomy/account';
import { ethers, type BigNumber } from 'ethers';
import {
	setNewTransaction,
	updateTransaction,
	type TxStore,
	type UUID,
	type SupportedSingleTransaction,
	type TxContext,
	increaseTxCounter
} from './state';
import { batchERC20Tx, batchSponsoredTx, batchUserTransaction, sponsoredTx } from './sponsored';
import { getAavePool, InterestRateMode } from '$stores/web3/getPoolData';
import { ADDRESSES, PAYMASTER_ADDRESSES } from '$lib/contracts';
import type { AppProvider } from '$stores/account';
import { getFeeCollector } from './batchActions';
import { getTransferFeeQuoteEth } from './fees';
import type { FinalQuote } from '../../routes/(connected)/swap/quote';
import type { Token } from '$lib/components/ui/swap/swap';
import { DEFAULT_BLOCK_CONFIRMATIONS } from '$lib/constants';

type SendUSDCFromEOAProps = {
	store: TxStore;
	id: string;
	destinationAddress: EthereumAddress;
	eoa: EthereumAddress;
	amount: BigNumber;
	provider: AppProvider;
	confirmations?: number;
};
export async function sendETHFromEOA({
	store,
	id,
	destinationAddress,
	eoa,
	amount,
	provider,
	confirmations = DEFAULT_BLOCK_CONFIRMATIONS
}: SendUSDCFromEOAProps) {
	try {
		const context: TxContext['DEPOSIT_ETH_INTO_SMART_ACCOUNT'] = {
			amount: Number(ethers.utils.formatEther(amount)),
			receiver: destinationAddress,
			sender: eoa
		};

		setNewTransaction(store, 'DEPOSIT_ETH_INTO_SMART_ACCOUNT', id, context);

		const signer = provider.getSigner();

		updateTransaction(store, id, {
			state: 'SIGNING',
			sponsored: false
		});

		const tx = await signer.sendTransaction({
			to: destinationAddress,
			value: amount
		});

		updateTransaction(store, id, {
			state: 'SIGNED',
			txReceiptHash: tx.hash as `0x${string}`
		});

		const receipt = await tx.wait(confirmations);

		if (receipt.status === 0) {
			updateTransaction(store, id, {
				state: 'REJECTED',
				finalTxHash: receipt.transactionHash as `0x${string}`
			});
		} else {
			increaseTxCounter(store);
			updateTransaction(store, id, {
				state: 'SUCCESSFUL',
				finalTxHash: receipt.transactionHash as `0x${string}`
			});
		}
	} catch (err: any) {
		updateTransaction(store, id, {
			error: err.message ?? err,
			state: 'FAILED'
		});
		console.error(err);
	}
}

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
	smartAccount: BiconomySmartAccountV2,
	id: string,
	transactionBuilder: (
		provider: AppProvider,
		id: UUID
	) => Promise<{ to: EthereumAddress; data: any; value?: BigNumber }[]>,
	context?: TxContext[keyof TxContext]
): Promise<void> {
	setNewTransaction(store, transactionType, id, context);
	const transactions = await transactionBuilder(provider, id);
	updateTransaction(store, id, {
		state: 'SIGNING'
	});
	await batchSponsoredTx(store, id, transactions, smartAccount);
}

async function handleUserPaidTransaction(
	store: TxStore,
	transactionType: SupportedSingleTransaction,
	provider: AppProvider,
	smartAccount: BiconomySmartAccountV2,
	id: string,
	transactionBuilder: (
		provider: AppProvider,
		id: UUID
	) => Promise<{ to: EthereumAddress; data: any; value?: BigNumber }[]>,
	context?: TxContext[keyof TxContext]
): Promise<void> {
	setNewTransaction(store, transactionType, id, context);
	const transactions = await transactionBuilder(provider, id);
	updateTransaction(store, id, {
		state: 'SIGNING'
	});
	await batchUserTransaction(store, id, transactions, smartAccount);
}

type ApproveWethSmartAccountProps = {
	store: TxStore;
	addressToApprove: EthereumAddress;
	amount: BigNumber;
	provider: AppProvider;
	smartAccount: BiconomySmartAccountV2;
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
	smartAccount: BiconomySmartAccountV2;
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
	smartAccount: BiconomySmartAccountV2;
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
	smartAccount: BiconomySmartAccountV2;
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
	smartAccount: BiconomySmartAccountV2;
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
	smartAccount: BiconomySmartAccountV2;
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

type SendETHProps = {
	store: TxStore;
	amount: BigNumber;
	provider: AppProvider;
	recipient: EthereumAddress;
	smartAccount: BiconomySmartAccountV2;
	id: string;
};
export function sendETH({ store, amount, recipient, provider, smartAccount, id }: SendETHProps) {
	const context: TxContext['TRANSFER'] = {
		amount: Number(ethers.utils.formatUnits(amount, 18)),
		recipient,
		token: 'ETH'
	};
	return handleUserPaidTransaction(
		store,
		'SEND_ETH',
		provider,
		smartAccount,
		id,
		async () => {
			return [
				{
					data: '0x',
					to: recipient,
					value: amount
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
	smartAccount: BiconomySmartAccountV2;
	id: string;
};
export async function sendUSDC({
	store,
	amount,
	recipient,
	provider,
	smartAccount,
	id
}: SendUSDCProps) {
	const context: TxContext['TRANSFER'] = {
		amount: Number(ethers.utils.formatUnits(amount, 6)),
		recipient,
		token: 'USDC'
	};

	setNewTransaction(store, 'SEND_USDC', id, context);

	const promiseUSDCAddress = getTokenAddress(provider, 'USDC');
	const promiseNetwork = provider.getNetwork();
	const [usdcAddress, network] = await Promise.all([promiseUSDCAddress, promiseNetwork]);

	const usdc = USDC__factory.connect(usdcAddress, provider);

	const tx0 = await usdc.populateTransaction.transfer(recipient, amount);
	const transactions = [
		{
			to: usdcAddress,
			data: tx0.data
		}
	];
	updateTransaction(store, id, {
		state: 'SIGNING'
	});

	const paymentToken = PAYMASTER_ADDRESSES[network.chainId].PAYMASTER_USDC;
	return await batchERC20Tx(store, id, transactions, smartAccount, paymentToken);
}

type ApproveUSDCProps = {
	store: TxStore;
	token: EthereumAddress;
	decimals: number;
	amount: BigNumber;
	spender: EthereumAddress;
	provider: AppProvider;
	smartAccount: BiconomySmartAccountV2;
	address: EthereumAddress;
	id: string;
	usePaymaster: boolean;
};

export async function approveERC20Token({
	store,
	token,
	decimals,
	amount,
	spender: spender,
	provider,
	smartAccount,
	address,
	id,
	usePaymaster
}: ApproveUSDCProps) {
	const context: TxContext['APPROVE_TOKEN'] = {
		amount: Number(ethers.utils.formatUnits(amount, decimals)),
		owner: address,
		spender: spender,
		token
	};

	setNewTransaction(store, 'APPROVE_TOKEN', id, context);

	// we use USDC but it could be any ERC20 token
	const tokenContract = USDC__factory.connect(token, provider);

	const tx0 = await tokenContract.populateTransaction.approve(spender, amount);
	const transactions = [
		{
			to: token,
			data: tx0.data
		}
	];
	updateTransaction(store, id, {
		state: 'SIGNING'
	});

	const network = await provider.getNetwork();

	// use USDC paymaster if token is USDC && user wants to use usdc
	if (token.toLowerCase() === ADDRESSES[network.chainId]['USDC'] && usePaymaster) {
		const paymentToken = PAYMASTER_ADDRESSES[network.chainId].PAYMASTER_USDC;
		return await batchERC20Tx(store, id, transactions, smartAccount, paymentToken);
	} else {
		// user must pay for the swap
		return await batchUserTransaction(store, id, transactions, smartAccount);
	}
}

type SwapTokenProps = {
	id: string;
	store: TxStore;
	quote: FinalQuote;
	smartAccount: BiconomySmartAccountV2;
	outToken: Token;
	provider: AppProvider;
	inToken: Token;
	usePaymaster: boolean;
};

export async function swapToken({
	store,
	quote,
	smartAccount,
	id,
	outToken,
	usePaymaster,
	provider,
	inToken
}: SwapTokenProps) {
	const context: TxContext['SWAP_TOKEN'] = { quote, outToken, inToken };

	setNewTransaction(store, 'SWAP_TOKEN', id, context);

	const transactions = [
		{
			to: quote.to,
			data: quote.data,
			value: quote.value,
			chainId: quote.chainId,
			gasLimit: quote.gas,
			gasPrice: quote.gasPrice
		}
	];

	updateTransaction(store, id, {
		state: 'SIGNING'
	});

	const network = await provider.getNetwork();

	// use USDC paymaster if token is USDC && user wants to use usdc
	if (usePaymaster) {
		const paymentToken = PAYMASTER_ADDRESSES[network.chainId].PAYMASTER_USDC;
		return await batchERC20Tx(store, id, transactions, smartAccount, paymentToken);
	} else {
		// user must pay for the swap
		return await batchUserTransaction(store, id, transactions, smartAccount);
	}
}
