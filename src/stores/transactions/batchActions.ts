import { AavePool__factory, USDC__factory, WETH__factory } from '$lib/abis/ts';
import { N, type EthereumAddress, delay } from '$lib/utils';
import { getTokenAddress } from '$stores/web3/getBalances';
import { getAavePool, InterestRateMode } from '$stores/web3/getPoolData';
import type { BiconomySmartAccount, BiconomySmartAccountV2 } from '@biconomy/account';
import { ethers } from 'ethers';
import { batchERC20Tx, batchSponsoredTx, batchUserTransaction } from './sponsored';
import { setNewTransaction, updateTransaction, type TxStore, type TxContext } from './state';
import type { AppProvider } from '$stores/account';
import * as process from '$env/static/public';
import { AMBOS_BORROW_FEE_PERCENT } from '$lib/constants';
import { getBorrowFeeQuote } from './fees';
import { type IHybridPaymaster, type FeeQuotesOrDataDto, PaymasterMode } from '@biconomy/paymaster';
import { PAYMASTER_ADDRESSES } from '$lib/contracts';

type IncreaseDebtProps = {
	store: TxStore;
	borrower: EthereumAddress;
	amountInEth: ethers.BigNumber;
	amountOutUsdc: ethers.BigNumber;
	interestRateMode: InterestRateMode;
	provider: AppProvider;
	smartAccount: BiconomySmartAccountV2;
	id: string;
};

export function getFeeCollector() {
	const feeCollector = process.PUBLIC_AMBOS_FEE_COLLECTOR;
	if (!feeCollector) {
		throw new Error('Missing environment variable: PUBLIC_AMBOS_FEE_COLLECTOR');
	}
	return feeCollector;
}

export async function increaseDebtWETH({
	borrower,
	amountInEth: amountInWeth,
	amountOutUsdc,
	interestRateMode,
	provider,
	smartAccount,
	id,
	store
}: IncreaseDebtProps) {
	const feeCollector = getFeeCollector();

	// create the tx in the store
	const transactionType = 'INCREASE_DEBT';
	setNewTransaction<TxContext['INCREASE_DEBT']>(store, transactionType, id, {
		ethToSupply: Number(N(amountInWeth)),
		usdToBorrow: Number(ethers.utils.formatUnits(amountOutUsdc, 6))
	});

	// add the fee
	const fee = amountOutUsdc.mul(AMBOS_BORROW_FEE_PERCENT).div(100);
	const totalPlusBorrowFee = amountOutUsdc.add(fee);

	// fetch the addresses
	const promiseWeth = getTokenAddress(provider, 'WETH');
	const promisePool = getAavePool(provider);
	const promiseUsdc = getTokenAddress(provider, 'USDC');
	const [wethAddr, poolAddr, usdcAddr] = await Promise.all([promiseWeth, promisePool, promiseUsdc]);

	// connect to the contracts
	const weth = WETH__factory.connect(wethAddr, provider);
	const pool = AavePool__factory.connect(poolAddr, provider);
	const usdc = USDC__factory.connect(usdcAddr, provider);

	const estimatedNetworkFee = await getBorrowFeeQuote({
		smartAccount,
		provider,
		amountInWeth,
		totalBorrow: totalPlusBorrowFee,
		borrower
	});

	const total = totalPlusBorrowFee.add(estimatedNetworkFee.big);

	// populate the transactions ready for signing
	const data0 = await weth.populateTransaction.approve(poolAddr, ethers.constants.MaxUint256);
	const data1 = await pool.populateTransaction.supply(wethAddr, amountInWeth, borrower, 0);
	const data2 = await pool.populateTransaction.borrow(
		usdcAddr,
		total,
		interestRateMode,
		0,
		borrower
	);
	const data3 = await usdc.populateTransaction.transfer(feeCollector, estimatedNetworkFee.big);
	const data4 = await usdc.populateTransaction.transfer(feeCollector, fee);

	const tx0 = { to: wethAddr, data: data0.data };
	const tx1 = { to: poolAddr, data: data1.data };
	const tx2 = { to: poolAddr, data: data2.data };
	const tx3 = { to: usdcAddr, data: data3.data };
	const tx4 = { to: usdcAddr, data: data4.data };

	const transactions = [tx0, tx1, tx2, tx3, tx4];

	// update the tx state and hand off to the sponsored tx function
	updateTransaction(store, id, {
		state: 'SIGNING'
	});

	await batchSponsoredTx(store, id, transactions, smartAccount);
}

export async function increaseDebtETH({
	borrower,
	amountInEth,
	amountOutUsdc,
	interestRateMode,
	provider,
	smartAccount,
	id,
	store
}: IncreaseDebtProps) {
	const feeCollector = getFeeCollector();

	// create the tx in the store
	const transactionType = 'INCREASE_DEBT';
	setNewTransaction<TxContext['INCREASE_DEBT']>(store, transactionType, id, {
		ethToSupply: Number(N(amountInEth)),
		usdToBorrow: Number(ethers.utils.formatUnits(amountOutUsdc, 6))
	});

	// add the fee
	const fee = amountOutUsdc.mul(AMBOS_BORROW_FEE_PERCENT).div(100);
	const total = amountOutUsdc.add(fee);

	// fetch the addresses
	const promiseWeth = getTokenAddress(provider, 'WETH');
	const promisePool = getAavePool(provider);
	const promiseUsdc = getTokenAddress(provider, 'USDC');
	const [wethAddr, poolAddr, usdcAddr] = await Promise.all([promiseWeth, promisePool, promiseUsdc]);

	// connect to the contracts
	const weth = WETH__factory.connect(wethAddr, provider);
	const pool = AavePool__factory.connect(poolAddr, provider);
	const usdc = USDC__factory.connect(usdcAddr, provider);

	// populate the transactions ready for signing
	const data1 = await weth.populateTransaction.approve(poolAddr, ethers.constants.MaxUint256);
	const data2 = await pool.populateTransaction.supply(wethAddr, amountInEth, borrower, 0);
	const data3 = await pool.populateTransaction.borrow(
		usdcAddr,
		total,
		interestRateMode,
		0,
		borrower
	);
	const data4 = await usdc.populateTransaction.transfer(feeCollector, fee);

	// transfer to WETH which wraps in the fallback function
	const tx0 = { to: wethAddr, data: '0x', value: amountInEth };
	const tx1 = { to: wethAddr, data: data1.data };
	const tx2 = { to: poolAddr, data: data2.data };
	const tx3 = { to: poolAddr, data: data3.data };
	const tx4 = { to: usdcAddr, data: data4.data };

	const transactions = [tx0, tx1, tx2, tx3, tx4];

	// update the tx state and hand off to the sponsored tx function
	updateTransaction(store, id, {
		state: 'SIGNING'
	});
	await batchUserTransaction(store, id, transactions, smartAccount);
}

type DecreaseDebtProps = {
	store: TxStore;
	repayAmountinUSDC: ethers.BigNumber;
	id: string;
	borrower: EthereumAddress;
	provider: AppProvider;
	smartAccount: BiconomySmartAccountV2;
};

export async function getDecreaseDebtFeeQuote({
	repayAmountinUSDC,
	borrower,
	provider,
	smartAccount
}: Omit<DecreaseDebtProps, 'id' | 'store'>) {
	const promiseUSDC = getTokenAddress(provider, 'USDC');
	const promisePool = getAavePool(provider);
	const promiseNetwork = provider.getNetwork();

	const [usdcAddr, poolAddr, network] = await Promise.all([
		promiseUSDC,
		promisePool,
		promiseNetwork
	]);

	const pool = AavePool__factory.connect(poolAddr, provider);
	const usdc = USDC__factory.connect(usdcAddr, provider);

	const data0 = await usdc.populateTransaction.approve(poolAddr, repayAmountinUSDC);
	const data1 = await pool.populateTransaction.repay(
		usdcAddr,
		repayAmountinUSDC,
		InterestRateMode.VARIABLE_IR,
		borrower
	);

	const tx0 = { to: usdcAddr, data: data0.data };
	const tx1 = { to: poolAddr, data: data1.data };

	const transactions = [tx0, tx1];

	const userOp = await smartAccount.buildUserOp(transactions);
	const paymaster = smartAccount.paymaster as IHybridPaymaster<FeeQuotesOrDataDto>;

	const feeQuotesResponse = await paymaster.getPaymasterFeeQuotesOrData(userOp, {
		mode: PaymasterMode.ERC20,
		tokenList: [PAYMASTER_ADDRESSES[network.chainId].PAYMASTER_USDC]
	});

	console.log({ feeQuotesResponse });

	return feeQuotesResponse?.feeQuotes?.[0] ?? null;
}

export async function decreaseDebt({
	store,
	repayAmountinUSDC,
	id,
	borrower,
	provider,
	smartAccount
}: DecreaseDebtProps) {
	const transactionType = 'DECREASE_DEBT';
	setNewTransaction<TxContext['DECREASE_DEBT']>(store, transactionType, id, {
		amount: Number(ethers.utils.formatUnits(repayAmountinUSDC, 6))
	});

	const promiseUSDC = getTokenAddress(provider, 'USDC');
	const promisePool = getAavePool(provider);
	const promiseNetwork = provider.getNetwork();

	const [usdcAddr, poolAddr, network] = await Promise.all([
		promiseUSDC,
		promisePool,
		promiseNetwork
	]);

	const pool = AavePool__factory.connect(poolAddr, provider);
	const usdc = USDC__factory.connect(usdcAddr, provider);

	const data0 = await usdc.populateTransaction.approve(poolAddr, repayAmountinUSDC);
	const data1 = await pool.populateTransaction.repay(
		usdcAddr,
		repayAmountinUSDC,
		InterestRateMode.VARIABLE_IR,
		borrower
	);

	const tx0 = { to: usdcAddr, data: data0.data };
	const tx1 = { to: poolAddr, data: data1.data };

	const transactions = [tx0, tx1];

	updateTransaction(store, id, {
		state: 'SIGNING'
	});

	const paymentToken = PAYMASTER_ADDRESSES[network.chainId].PAYMASTER_USDC;

	return await batchERC20Tx(store, id, transactions, smartAccount, paymentToken);
}

type RemoveETHProps = {
	store: TxStore;
	removeAmountInWei: ethers.BigNumber;
	id: string;
	borrower: EthereumAddress;
	provider: AppProvider;
	smartAccount: BiconomySmartAccountV2;
};

export async function getRemoveCollateralFeeQuote({
	removeAmountInWei,
	borrower,
	provider,
	smartAccount
}: Omit<RemoveETHProps, 'id' | 'store'>) {
	const promiseAWETH = getTokenAddress(provider, 'aWETH');
	const promiseWETH = getTokenAddress(provider, 'WETH');
	const promisePool = getAavePool(provider);
	const promiseNetwork = provider.getNetwork();

	const [aWETHAddr, wethAddr, poolAddr, network] = await Promise.all([
		promiseAWETH,
		promiseWETH,
		promisePool,
		promiseNetwork
	]);

	const pool = AavePool__factory.connect(poolAddr, provider);
	// we can use the WETH interface to interact with aWETH as a standard ERC20
	const aWETH = WETH__factory.connect(aWETHAddr, provider);
	const weth = WETH__factory.connect(wethAddr, provider);

	const data0 = await aWETH.populateTransaction.approve(poolAddr, removeAmountInWei);
	const data1 = await pool.populateTransaction.withdraw(wethAddr, removeAmountInWei, borrower);
	// unwrap the weth to eth
	const data2 = await weth.populateTransaction.approve(wethAddr, removeAmountInWei);
	const data3 = await weth.populateTransaction.withdraw(removeAmountInWei);

	const tx0 = { to: aWETHAddr, data: data0.data };
	const tx1 = { to: poolAddr, data: data1.data };
	const tx2 = { to: wethAddr, data: data2.data };
	const tx3 = { to: wethAddr, data: data3.data };

	const transactions = [tx0, tx1, tx2, tx3];

	const userOp = await smartAccount.buildUserOp(transactions);
	const paymaster = smartAccount.paymaster as IHybridPaymaster<FeeQuotesOrDataDto>;

	const feeQuotesResponse = await paymaster.getPaymasterFeeQuotesOrData(userOp, {
		mode: PaymasterMode.ERC20,
		tokenList: [PAYMASTER_ADDRESSES[network.chainId].PAYMASTER_USDC]
	});

	console.log({ feeQuotesResponse });

	return feeQuotesResponse?.feeQuotes?.[0] ?? null;
}

export async function removeCollateral({
	store,
	removeAmountInWei,
	id,
	borrower,
	provider,
	smartAccount
}: RemoveETHProps) {
	const transactionType = 'REMOVE_COLLATERAL';
	setNewTransaction<TxContext['REMOVE_COLLATERAL']>(store, transactionType, id, {
		amount: Number(ethers.utils.formatUnits(removeAmountInWei, 18))
	});

	const promiseAWETH = getTokenAddress(provider, 'aWETH');
	const promiseWETH = getTokenAddress(provider, 'WETH');
	const promisePool = getAavePool(provider);
	const promiseNetwork = provider.getNetwork();

	const [aWETHAddr, wethAddr, poolAddr, _] = await Promise.all([
		promiseAWETH,
		promiseWETH,
		promisePool,
		promiseNetwork
	]);

	const pool = AavePool__factory.connect(poolAddr, provider);
	// we can use the WETH interface to interact with aWETH as a standard ERC20
	const aWETH = WETH__factory.connect(aWETHAddr, provider);
	const weth = WETH__factory.connect(wethAddr, provider);

	const data0 = await aWETH.populateTransaction.approve(poolAddr, removeAmountInWei);
	const data1 = await pool.populateTransaction.withdraw(wethAddr, removeAmountInWei, borrower);
	// unwrap the weth to eth
	const data2 = await weth.populateTransaction.approve(wethAddr, removeAmountInWei);
	const data3 = await weth.populateTransaction.withdraw(removeAmountInWei);

	const tx0 = { to: aWETHAddr, data: data0.data };
	const tx1 = { to: poolAddr, data: data1.data };
	const tx2 = { to: wethAddr, data: data2.data };
	const tx3 = { to: wethAddr, data: data3.data };

	const transactions = [tx0, tx1, tx2, tx3];
	updateTransaction(store, id, {
		state: 'SIGNING'
	});

	return await batchSponsoredTx(store, id, transactions, smartAccount);
}
