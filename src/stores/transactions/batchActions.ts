import { AavePool__factory, USDC__factory, WETH__factory } from '$lib/abis/ts';
import { N, type EthereumAddress, delay } from '$lib/utils';
import { getTokenAddress } from '$stores/web3/getBalances';
import { getAavePool, InterestRateMode } from '$stores/web3/getPoolData';
import type { BiconomySmartAccount } from '@biconomy/account';
import { ethers } from 'ethers';
import { batchSponsoredTx } from './sponsored';
import { setNewTransaction, updateTransaction, type TxStore, type TxContext } from './state';
import type { AppProvider } from '$stores/account';
import * as process from '$env/static/public';
import { AMBOS_BORROW_FEE_PERCENT } from '$lib/constants';
import { getBorrowFeeQuote } from './fees';

type IncreaseDebtProps = {
	store: TxStore;
	borrower: EthereumAddress;
	amountInWeth: ethers.BigNumber;
	amountOutUsdc: ethers.BigNumber;
	interestRateMode: InterestRateMode;
	provider: AppProvider;
	smartAccount: BiconomySmartAccount;
	id: string;
};

export function getFeeCollector() {
	const feeCollector = process.PUBLIC_AMBOS_FEE_COLLECTOR;
	if (!feeCollector) {
		throw new Error('Missing environment variable: PUBLIC_AMBOS_FEE_COLLECTOR');
	}
	return feeCollector;
}

export async function increaseDebt({
	borrower,
	amountInWeth,
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

	console.warn('estimated network fees will return 0 if undefined');
	const total = totalPlusBorrowFee.add(estimatedNetworkFee.big);
	const totalFees = fee.add(estimatedNetworkFee.big);

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

type DecreaseDebtProps = {
	store: TxStore;
	repayAmountinUSDC: ethers.BigNumber;
	id: string;
};
export async function decreaseDebt({ store, repayAmountinUSDC, id }: DecreaseDebtProps) {
	const transactionType = 'DECREASE_DEBT';
	setNewTransaction<TxContext['DECREASE_DEBT']>(store, transactionType, id, {
		amount: Number(ethers.utils.formatUnits(repayAmountinUSDC, 6))
	});

	await delay(10_000);
	updateTransaction(store, id, {
		state: 'SUCCESSFUL'
	});
}
