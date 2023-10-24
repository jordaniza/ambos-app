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

export type FeesAndCharges = {
	ambosFee: number;
	networkFee: number;
	total: number;
	exchangeFee: number;
	percentOfBorrowed: number;
};
export function getFeesAndCharges(borrowedUSD: number): FeesAndCharges {
	const ambosFee = (borrowedUSD * AMBOS_BORROW_FEE_PERCENT) / 100;

	const networkFee = 20;

	// a best guess assuming 3%
	const exchangeFee = borrowedUSD * (3 / 100);

	const total = ambosFee + networkFee + exchangeFee;
	const percentOfBorrowed = total / borrowedUSD;

	return {
		exchangeFee,
		ambosFee,
		networkFee,
		total,
		percentOfBorrowed
	};
}

/**
 * @returns the minimum value that your total supplied ETH must be to not be liquidated
 */
export function getMinimumDepositValue(liquidationPrice: number, suppliedETH: number): number {
	return liquidationPrice * suppliedETH;
}

/// -------- SIMULATION FUNCTIONS --------

export function getPercentageEthPriceChange(ethPriceOriginal: number, ethPriceNew: number): number {
	return (ethPriceNew - ethPriceOriginal) / ethPriceOriginal;
}

export function getEthValueInOneYear(
	suppliedETH: number,
	ethPriceOriginal: number,
	ethPriceChangePercent: number
): number {
	const newEthPrice = ethPriceOriginal * (1 + ethPriceChangePercent);
	return suppliedETH * newEthPrice;
}

export function getAbsoluteReturnInOneYear(
	suppliedETH: number,
	ethPriceOriginal: number,
	ethPriceChangePercent: number
): number {
	return (
		getEthValueInOneYear(suppliedETH, ethPriceOriginal, ethPriceChangePercent) -
		getEthValue(suppliedETH, ethPriceOriginal)
	);
}

export function getInterestOnLoanInOneYear(interestRate: number, borrowedUSD: number): number {
	return borrowedUSD * interestRate;
}

export function getReturnsAfterInterestAndFees(
	suppliedETH: number,
	ethPriceOriginal: number,
	ethPriceChangePercent: number,
	interestRate: number,
	borrowedUSD: number
): number {
	const fees = getFeesAndCharges(borrowedUSD).total;
	const absoluteReturn = getAbsoluteReturnInOneYear(
		suppliedETH,
		ethPriceOriginal,
		ethPriceChangePercent
	);
	const interest = getInterestOnLoanInOneYear(interestRate, borrowedUSD);
	return absoluteReturn - interest - fees;
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
