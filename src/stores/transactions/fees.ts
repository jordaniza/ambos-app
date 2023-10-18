import { AavePool__factory, USDC__factory, WETH__factory } from '$lib/abis/ts';
import type { AppProvider } from '$stores/account';
import { getTokenAddress } from '$stores/web3/getBalances';
import { InterestRateMode, getAavePool } from '$stores/web3/getPoolData';
import type { BiconomySmartAccount } from '@biconomy/account';
import {
	PaymasterMode,
	type IHybridPaymaster,
	type SponsorUserOperationDto
} from '@biconomy/paymaster';
import { ethers } from 'ethers';
import { getFeeCollector } from './batchActions';
import type { EthereumAddress } from '$lib/utils';

type GetFeeQuoteProps = {
	smartAccount: BiconomySmartAccount;
	provider: AppProvider;
	totalBorrow?: ethers.BigNumber;
	borrower?: EthereumAddress;
	amountInWeth?: ethers.BigNumber;
};
export async function getBorrowFeeQuote({
	smartAccount,
	provider,
	// dummy data that is optional
	amountInWeth = ethers.utils.parseEther('1'),
	totalBorrow = ethers.utils.parseUnits('1000', 6),
	borrower = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // vitalik is our guinea pig
}: GetFeeQuoteProps) {
	const feeCollector = getFeeCollector();

	// fetch the addresses
	const promiseWeth = getTokenAddress(provider, 'WETH');
	const promisePool = getAavePool(provider);
	const promiseUsdc = getTokenAddress(provider, 'USDC');
	const [wethAddr, poolAddr, usdcAddr] = await Promise.all([promiseWeth, promisePool, promiseUsdc]);

	// connect to the contracts
	const weth = WETH__factory.connect(wethAddr, provider);
	const pool = AavePool__factory.connect(poolAddr, provider);
	const usdc = USDC__factory.connect(usdcAddr, provider);

	// populate the transactions
	const data0 = await weth.populateTransaction.approve(poolAddr, ethers.constants.MaxUint256);
	const data1 = await pool.populateTransaction.supply(wethAddr, amountInWeth, borrower, 0);
	const data2 = await pool.populateTransaction.borrow(
		usdcAddr,
		totalBorrow,
		InterestRateMode.STABLE_IR,
		0,
		borrower
	);
	const data3 = await usdc.populateTransaction.transfer(feeCollector, totalBorrow.sub(1));

	const tx0 = { to: wethAddr, data: data0.data };
	const tx1 = { to: poolAddr, data: data1.data };
	const tx2 = { to: poolAddr, data: data2.data };
	const tx3 = { to: usdcAddr, data: data3.data };

	const transactions = [tx0, tx1, tx2, tx3];
	const userOp = await smartAccount.buildUserOp(transactions);
	const paymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
	const feeQuotesResponse = await paymaster.getPaymasterFeeQuotesOrData(userOp, {
		mode: PaymasterMode.ERC20,
		tokenList: [] // empty list means all tokens
	});

	console.log({ feeQuotesResponse });
	console.warn("fee quotes are hardcoded to 'USDC'");
	let usdcFeeQuote =
		feeQuotesResponse?.feeQuotes?.find((quote) => quote.symbol === 'USDC')?.maxGasFeeUSD ?? 0;

	const usdcFeeQuoteTruncated = truncateAndRound(usdcFeeQuote.toString());

	return {
		big: ethers.utils.parseUnits(usdcFeeQuoteTruncated, 6),
		small: Number(usdcFeeQuoteTruncated),
		original: usdcFeeQuote
	};
}

function truncateAndRound(value: string): string {
	let [whole, decimal] = value.split('.');
	if (decimal && decimal.length > 6) {
		decimal = decimal.slice(0, 6);
		let roundUp = Number(decimal.slice(5, 6)) >= 5;
		decimal = decimal.slice(0, 5);
		if (roundUp) {
			decimal = (Number(decimal) + 1).toString();
		}
		return `${whole}.${decimal}`;
	}
	return value;
}
