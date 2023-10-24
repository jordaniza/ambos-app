/// A set of functions for the calculator component

import { AMBOS_BORROW_FEE_PERCENT, MAX_BORROW_PERCENTAGE } from '$lib/constants';
import { getLiquidationPrice as _getLiquidationPrice } from '$lib/utils';

export function getEthValue(value: number, ethPrice: number): number {
	return value * ethPrice;
}

/**
 * @param suppliedETH in ETH, not wei
 * @param ethPrice in USD
 * @param maxBorrowPercentage in whole numbers
 * @returns
 */
export function getMaxBorrow(
	suppliedETH: number,
	ethPrice: number,
	maxBorrowPercentage = MAX_BORROW_PERCENTAGE
): number {
	return getEthValue(suppliedETH, ethPrice) * (maxBorrowPercentage / 100);
}

export function getLiquidationPrice(
	suppliedETH: number,
	borrowedUSD: number,
	maxLTV: number
): number {
	return _getLiquidationPrice(borrowedUSD, suppliedETH, maxLTV);
}

/**
 * @returns the minimum value that your total supplied ETH must be to not be liquidated
 */
export function getMinimumDepositValue(liquidationPrice: number, suppliedETH: number): number {
	return liquidationPrice * suppliedETH;
}

export function getAmbosFee(borrowUSD: number): number {
	return (borrowUSD * AMBOS_BORROW_FEE_PERCENT) / 100;
}

/// -------- SIMULATION FUNCTIONS --------

export function getPercentageEthPriceChange(ethPriceOriginal: number, ethPriceNew: number): number {
	return (ethPriceNew - ethPriceOriginal) / ethPriceOriginal;
}

export function getNewEthPrice(ethPriceOriginal: number, ethPriceChangePercent: number): number {
	return ethPriceOriginal * (1 + ethPriceChangePercent / 100);
}

export function getEthValueInOneYear(
	suppliedETH: number,
	ethPriceOriginal: number,
	ethPriceChangePercent: number
): number {
	const newEthPrice = getNewEthPrice(ethPriceOriginal, ethPriceChangePercent);
	return suppliedETH * newEthPrice;
}

export function getAbsoluteReturnInOneYearVsSelling(
	suppliedETH: number,
	ethPriceOriginal: number,
	ethPriceChangePercent: number,
	borrowedUSD: number
): number {
	const ethIn1yrNoSell = getEthValueInOneYear(suppliedETH, ethPriceOriginal, ethPriceChangePercent);
	const ethIn1yrSell = getEthValueRemainingIfUserHadSold(
		suppliedETH,
		ethPriceOriginal,
		ethPriceChangePercent,
		borrowedUSD
	);
	return ethIn1yrNoSell - ethIn1yrSell;
}

export function getInterestOnLoanInOneYear(interestRate: number, borrowedUSD: number): number {
	return getAmbosFee(borrowedUSD) * interestRate;
}

export function getReturnsAfterInterestAndFees(
	suppliedETH: number,
	ethPriceOriginal: number,
	ethPriceChangePercent: number,
	interestRate: number,
	borrowedUSD: number
): number {
	const absoluteReturn = getAbsoluteReturnInOneYearVsSelling(
		suppliedETH,
		ethPriceOriginal,
		ethPriceChangePercent,
		borrowedUSD
	);
	const fees = getAmbosFee(borrowedUSD);
	const interest = getInterestOnLoanInOneYear(interestRate, borrowedUSD);
	return absoluteReturn - (interest + fees);
}

export function getEthValueRemainingIfUserHadSold(
	suppliedETH: number,
	ethPriceOriginal: number,
	ethPriceChangePercent: number,
	borrowedUSD: number
): number {
	const ethValue = getEthValue(suppliedETH, ethPriceOriginal);
	const ethValueAfterSelling = ethValue - borrowedUSD;
	const ethAfterSelling = ethValueAfterSelling / ethPriceOriginal;
	const ethValueInOneYear = getEthValueInOneYear(
		ethAfterSelling,
		ethPriceOriginal,
		ethPriceChangePercent
	);

	return ethValueInOneYear;
}
