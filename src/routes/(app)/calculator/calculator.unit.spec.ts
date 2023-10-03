import { describe, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import {
	getLiquidationPrice,
	getAbsoluteReturnInOneYear,
	getEthValueRemainingIfUserHadSold,
	getFeesAndCharges,
	getMaxBorrow,
	getMinimumDepositValue,
	getReturnsAfterInterestAndFees
} from './calculator';
import { e } from '$lib/utils';

const ONE_WEI = 1 / 10 ** 18;

// sensibly bounded float
const bFloat = (min = ONE_WEI, max = Infinity) =>
	fc.float({
		min: Math.fround(min),
		max: Math.fround(max),
		maxExcluded: true,
		noNaN: true
	});

describe('Testing the calculator functions', () => {
	test.prop({
		suppliedEth: bFloat(),
		ethPrice: bFloat()
	})('max borrow is set to 50% of the supplied value in ETH', ({ suppliedEth, ethPrice }) => {
		return getMaxBorrow(suppliedEth, ethPrice) === suppliedEth * ethPrice * 0.5;
	});

	describe('Liquidation Prices', () => {
		test('Hardcoded liquidation price', () => {
			const suppliedETH = 10;
			const borrowedUSD = 5000;
			const maxLTV = 0.85;

			/**
			 * With 10k in ETH for 5k borrow, we need to find what
			 * value of ETH would be equal to having 5000 as 85% of the value
			 * This would be 5882.352941176471 USD Value, which is 588.2352941176471 ETH
			 */
			const expectedLiquidationPrice = 588.2352941176471;
			const liquidationPrice = getLiquidationPrice(suppliedETH, borrowedUSD, maxLTV);
			expect(liquidationPrice).toBe(expectedLiquidationPrice);
		});

		test.prop({
			suppliedETH: bFloat(),
			borrowedUSD: bFloat(),
			maxLTV: bFloat()
		})('Liquidation price works in the general case', ({ suppliedETH, borrowedUSD, maxLTV }) => {
			let expectedLiquidationPrice = borrowedUSD / maxLTV / suppliedETH;
			const diff = expectedLiquidationPrice - getLiquidationPrice(suppliedETH, borrowedUSD, maxLTV);
			const absDiff = Math.abs(diff);
			const pcAbsDiff = absDiff / expectedLiquidationPrice;
			return pcAbsDiff < 0.00001;
		});

		test('Hardcoded minimum deposit value', () => {
			const suppliedETH = 10;
			const borrowedUSD = 5000;
			const maxLTV = 0.85;
			const expectedLiquidationPrice = 588.2352941176471;

			const expectedMinimumDepositValue = expectedLiquidationPrice * suppliedETH;
			const actualLiquidationPrice = getLiquidationPrice(suppliedETH, borrowedUSD, maxLTV);
			const minimumDepositValue = getMinimumDepositValue(actualLiquidationPrice, suppliedETH);

			expect(minimumDepositValue).toBe(expectedMinimumDepositValue);
		});

		test.prop({
			suppliedETH: bFloat(),
			borrowedUSD: bFloat(),
			maxLTV: bFloat()
		})(
			'Minimum deposit value works in the general case',
			({ suppliedETH, borrowedUSD, maxLTV }) => {
				const liquidationPrice = getLiquidationPrice(suppliedETH, borrowedUSD, maxLTV);
				const expectedMinimumDepositValue = liquidationPrice * suppliedETH;
				const minimumDepositValue = getMinimumDepositValue(liquidationPrice, suppliedETH);
				return minimumDepositValue === expectedMinimumDepositValue;
			}
		);
	});

	describe('Fees and Charges', () => {
		test.prop({
			suppliedETHUSDValue: bFloat(),
			borrowedUSD: bFloat()
		})('Fees and charges are calculated correctly', ({ suppliedETHUSDValue, borrowedUSD }) => {
			const feesAndCharges = getFeesAndCharges(suppliedETHUSDValue, borrowedUSD);
			expect(feesAndCharges.ambosFee).toBe(suppliedETHUSDValue * 0.01);
			expect(feesAndCharges.networkFee).toBe(20);
			expect(feesAndCharges.exchangeFee).toBe(borrowedUSD * 0.03);
			expect(feesAndCharges.total).toBe(suppliedETHUSDValue * 0.01 + 20 + borrowedUSD * 0.03);
		});
	});

	describe('Simulations', () => {
		test('Hardcoded absolute return value in one year', () => {
			const suppliedETH = 10;
			const ethPrice = 2000;
			const ethPriceChange = 0.5;
			const initialETHValue = 20_000;
			const ethValueInOneYear = 30_000;
			const expectedReturnOneYr = ethValueInOneYear - initialETHValue;
			const returnOneYr = getAbsoluteReturnInOneYear(suppliedETH, ethPrice, ethPriceChange);
			return returnOneYr === expectedReturnOneYr;
		});

		test('Correctly computes expected return net of fees and interest in one year', () => {
			const suppliedETH = 15;
			const ethPrice = 1500;
			const borrowed = 8000;
			const interestRate = 0.03;
			const ethPriceChange = 1.5;
			const initialETHValue = 22_500;
			const ethValueInOneYear = 56_250;
			const expectedReturnOneYr = ethValueInOneYear - initialETHValue;
			const expectedFees = 8000 * 0.03 + 15 * 1500 * 0.01 + 20;
			const interest = borrowed * interestRate;
			const totalCharges = expectedFees + interest;
			const expectedAbsReturn = expectedReturnOneYr - totalCharges;

			const netReturn = getReturnsAfterInterestAndFees(
				suppliedETH,
				ethPrice,
				ethPriceChange,
				interestRate,
				borrowed
			);
			expect(netReturn).toBe(expectedAbsReturn);
		});

		test('Correctly calculates eth value after a year if the user had sold', () => {
			const suppliedETH = 5;
			const ethPrice = 3000;
			const ethPriceChange = 0.5;
			const borrowed = 7000;
			const ethValueAfterSelling = 8000;
			const ethLeftAfterSelling = (suppliedETH * ethPrice - borrowed) / ethPrice;
			expect(ethLeftAfterSelling).toBe(ethValueAfterSelling / ethPrice);

			const expectedEthValueAfterOneYear = ethValueAfterSelling * (1 + ethPriceChange);

			const ethValueAfterOneYear = getEthValueRemainingIfUserHadSold(
				suppliedETH,
				ethPrice,
				ethPriceChange,
				borrowed
			);

			expect(ethValueAfterOneYear).toBe(expectedEthValueAfterOneYear);
		});
	});
});
