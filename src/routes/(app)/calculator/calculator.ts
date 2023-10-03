/// A set of functions for the calculator component

import { getLiquidationPrice as _getLiquidationPrice } from '$lib/utils';

export const MAX_BORROW_PERCENTAGE = 0.5;

export function getEthValue(value: number, ethPrice: number): number {
	return value * ethPrice;
}

export function getMaxBorrow(
	suppliedETH: number,
	ethPrice: number,
	maxBorrowPercentage = MAX_BORROW_PERCENTAGE
): number {
	return getEthValue(suppliedETH, ethPrice) * maxBorrowPercentage;
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
	exchangeFee: number;
	total: number;
	percentOfBorrowed: number;
};
export function getFeesAndCharges(
	suppliedETHUSDValue: number,
	borrowedUSD: number
): FeesAndCharges {
	// ambos fee is 1% of supplied value
	const ambosFee = suppliedETHUSDValue * 0.01;

	// network fees are ~ $20
	const networkFee = 20;

	// exchange and off ramps are ~ 3-4% on the borrowed value
	const exchangeFee = borrowedUSD * 0.03;

	const total = ambosFee + networkFee + exchangeFee;
	const percentOfBorrowed = total / borrowedUSD;

	return {
		ambosFee,
		networkFee,
		exchangeFee,
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
	const fees = getFeesAndCharges(getEthValue(suppliedETH, ethPriceOriginal), borrowedUSD).total;
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
