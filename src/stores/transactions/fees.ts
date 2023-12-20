import { AavePool__factory, USDC__factory, WETH__factory } from '$lib/abis/ts';
import type { AppProvider } from '$stores/account';
import { getTokenAddress } from '$stores/web3/getBalances';
import { InterestRateMode, getAavePool } from '$stores/web3/getPoolData';
import type { BiconomySmartAccount, BiconomySmartAccountV2 } from '@biconomy/account';
import {
	PaymasterMode,
	type IHybridPaymaster,
	type SponsorUserOperationDto
} from '@biconomy/paymaster';
import type { Transaction } from '@biconomy/core-types';
import { ethers } from 'ethers';
import { getFeeCollector } from './batchActions';
import type { EthereumAddress } from '$lib/utils';
import type { TSupportedTokens } from '$lib/contracts';
import type { FinalQuote } from '../../routes/(connected)/swap/quote';

async function getFeeQuoteFromUserOp({
	smartAccount,
	transactions
}: {
	smartAccount: BiconomySmartAccountV2;
	transactions: Transaction[];
}): Promise<{
	big: ethers.BigNumber;
	small: number;
	original: number;
	originalCurrency: TSupportedTokens;
}> {
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

	const usdcFeeQuoteTruncated = truncateAndRound(usdcFeeQuote.toString(), 6);

	return {
		big: ethers.utils.parseUnits(usdcFeeQuoteTruncated, 6),
		small: Number(usdcFeeQuoteTruncated),
		original: usdcFeeQuote,
		originalCurrency: 'USDC'
	};
}

export const convertScientificNotationNumber = (value: number, units: number = 18): string => {
	const decimalsPart = value?.toString()?.split('.')?.[1] || '';
	const eDecimals = Number(decimalsPart?.split('e-')?.[1]) || 0;
	const countOfDecimals = decimalsPart.length + eDecimals;
	const boundedCountOfDecimals = Math.min(countOfDecimals, units);
	return Number(value).toFixed(boundedCountOfDecimals);
};

async function getFeeQuoteInWETH(usdFeeQuote: number): Promise<string | undefined> {
	try {
		const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
		const response = await fetch(url);
		const json = await response.json();
		const ethPrice = json.ethereum.usd;

		// avoid scientific notation
		let feeQuoteInEth = usdFeeQuote / ethPrice;
		return convertScientificNotationNumber(feeQuoteInEth);
	} catch (e) {
		console.error('Failed to fetch coingecko fee quote', e);
	}
}

type GetTrasferFeeQuoteProps = {
	smartAccount: BiconomySmartAccountV2;
	provider: AppProvider;
	transferQty: ethers.BigNumber;
	token: TSupportedTokens;
	recipient?: EthereumAddress;
};

export async function getTransferFeeQuote({
	smartAccount,
	provider,
	transferQty,
	token,
	recipient = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // vitalik is our guinea pig
}: GetTrasferFeeQuoteProps) {
	const promiseToken = await getTokenAddress(provider, token);
	// any ERC20 is fine
	const tokenContract = USDC__factory.connect(promiseToken, provider);

	// populate the transaction
	const { data } = await tokenContract.populateTransaction.transfer(recipient, transferQty);
	if (!data) throw new Error('no data for transfer quote');

	const tx0 = { to: promiseToken, data };
	const transactions = [tx0];
	return await getFeeQuoteFromUserOp({ smartAccount, transactions });
}

type GetApproveFeeQuoteProps = {
	smartAccount: BiconomySmartAccountV2;
	provider: AppProvider;
	token: EthereumAddress;
	spender: EthereumAddress;
};

export async function getApproveFeeQuote({
	smartAccount,
	provider,
	token,
	spender = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'
}: GetApproveFeeQuoteProps) {
	// any ERC20 is fine
	const tokenContract = USDC__factory.connect(token, provider);

	// populate the transaction
	const { data } = await tokenContract.populateTransaction.approve(
		spender,
		ethers.constants.MaxUint256
	);
	if (!data) throw new Error('no data for approve quote');

	const tx0 = { to: token, data };
	const transactions = [tx0];
	return await getFeeQuoteFromUserOp({ smartAccount, transactions });
}

type GetFinalSwapFeeQuoteProps = {
	smartAccount: BiconomySmartAccountV2;
	quote: FinalQuote;
};
export async function getFinalSwapFeeQuote({ smartAccount, quote }: GetFinalSwapFeeQuoteProps) {
	const transactions = [
		{
			gasLimit: quote.gas,
			gasPrice: quote.gasPrice,
			to: quote.allowanceTarget,
			data: quote.data,
			value: quote.value,
			chainId: quote.chainId
		}
	];
	return await getFeeQuoteFromUserOp({ smartAccount, transactions });
}

export async function getTransferFeeQuoteEth({
	smartAccount,
	provider,
	transferQty,
	token,
	recipient = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // vitalik is our guinea pig
}: GetTrasferFeeQuoteProps) {
	const promiseToken = await getTokenAddress(provider, token);
	// any ERC20 is fine
	const tokenContract = USDC__factory.connect(promiseToken, provider);

	// populate the transaction
	const { data } = await tokenContract.populateTransaction.transfer(recipient, transferQty);
	if (!data) throw new Error('no data for transfer quote');

	const tx0 = { to: promiseToken, data };
	const transactions = [tx0];

	const usdcFeeQuote = await getFeeQuoteFromUserOp({ smartAccount, transactions });
	const wethFeeQuote = await getFeeQuoteInWETH(usdcFeeQuote.small);

	if (!wethFeeQuote) throw new Error('no weth fee quote');

	return {
		small: Number(wethFeeQuote),
		big: ethers.utils.parseUnits(wethFeeQuote, 18),
		original: usdcFeeQuote.original,
		originalCurrency: 'USDC'
	};
}

type GetBorrowFeeQuoteProps = {
	smartAccount: BiconomySmartAccountV2;
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
}: GetBorrowFeeQuoteProps) {
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
		InterestRateMode.VARIABLE_IR,
		0,
		borrower
	);
	const data3 = await usdc.populateTransaction.transfer(feeCollector, totalBorrow.sub(1));

	if (!data0.data || !data1.data || !data2.data || !data3.data)
		throw new Error('no data for borrow quote');

	const tx0 = { to: wethAddr, data: data0.data };
	const tx1 = { to: poolAddr, data: data1.data };
	const tx2 = { to: poolAddr, data: data2.data };
	const tx3 = { to: usdcAddr, data: data3.data };

	const transactions = [tx0, tx1, tx2, tx3];

	return await getFeeQuoteFromUserOp({ smartAccount, transactions });
}

function truncateAndRound(value: string, units: number): string {
	let [whole, decimal] = value.split('.');
	if (decimal && decimal.length > units) {
		decimal = decimal.slice(0, units);
		return `${whole}.${decimal}`;
	}
	return value;
}
