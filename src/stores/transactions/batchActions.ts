import { AavePool__factory, WETH__factory } from '$lib/abis/ts';
import type { EthereumAddress } from '$lib/utils';
import { getTokenAddress } from '$stores/web3/getBalances';
import { getAavePool, InterestRateMode } from '$stores/web3/getPoolData';
import type { BiconomySmartAccount } from '@biconomy/account';
import { ethers } from 'ethers';
import { batchSponsoredTx } from './sponsored';
import { setNewTransaction, updateTransaction, type TxStore } from './state';

export async function getCashNow(
	store: TxStore,
	borrower: EthereumAddress,
	amountInWeth: ethers.BigNumber,
	amountOutUsdc: ethers.BigNumber,
	interestRateMode: InterestRateMode,
	provider: ethers.providers.Web3Provider,
	smartAccount: BiconomySmartAccount
) {
	const transactionType = 'INCREASE_DEBT';
	const id = setNewTransaction(store, transactionType);

	const promiseWeth = getTokenAddress(provider, 'WETH');
	const promisePool = getAavePool(provider);
	const promisUsdc = getTokenAddress(provider, 'USDC');
	const [wethAddr, poolAddr, usdcAddr] = await Promise.all([promiseWeth, promisePool, promisUsdc]);
	const weth = WETH__factory.connect(wethAddr, provider);
	const pool = AavePool__factory.connect(poolAddr, provider);

	// create the txs - might need to be sequential or nonce will be off
	const data0 = await weth.populateTransaction.approve(poolAddr, ethers.constants.MaxUint256);
	const data1 = await pool.populateTransaction.supply(wethAddr, amountInWeth, borrower, 0);
	const data2 = await pool.populateTransaction.borrow(
		usdcAddr,
		amountOutUsdc,
		interestRateMode,
		0,
		borrower
	);

	updateTransaction(store, id, {
		state: 'SIGNING'
	});

	const tx0 = { to: wethAddr, data: data0.data };
	const tx1 = { to: poolAddr, data: data1.data };
	const tx2 = { to: poolAddr, data: data2.data };

	// create the batch
	await batchSponsoredTx(store, id, [tx0, tx1, tx2], smartAccount);
}
