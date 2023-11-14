<script lang="ts">
	import { e, f, pc } from '$lib/utils';
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Range from '$lib/components/range/range.svelte';
	import CalculatorBars from '$lib/components/charts/calculatorBars.svelte';
	import { LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import {
		getEthValue,
		getEthValueRemainingIfUserHadSold,
		getAmbosFee,
		getLiquidationPrice,
		getMaxBorrow,
		getMinimumDepositValue,
		getPercentageEthPriceChange,
		getInterestOnLoanInOneYear,
		getNewEthPrice
	} from '$lib/components/calculator/calculator';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { cacheFetch } from '$lib/cache';
	import { goto } from '$app/navigation';

	let ethMaxValue = 10;
	let ethSupplyQty = 5;
	let borrowAmountUSD = 5000;
	let ethPriceChangeWholePc = 20; // Initial value
	let newEthPrice = 0;
	let interestRate = 5; // 5%
	let estimatedNetworkFee = 0.01;
	let ethPrice = 0;
	let maxLTV = 0.8;

	// Computed values
	$: maxBorrow = getMaxBorrow(ethSupplyQty, ethPrice);
	$: liquidationPrice = getLiquidationPrice(ethSupplyQty, borrowAmountUSD, maxLTV);
	$: minDepositValue = getMinimumDepositValue(liquidationPrice, ethSupplyQty);
	$: depositUSDValue = getEthValue(ethSupplyQty, ethPrice);
	$: ambosFee = getAmbosFee(borrowAmountUSD);
	$: percentageChangeInEthPrice = getPercentageEthPriceChange(ethPrice, newEthPrice);
	$: newEthPrice = getNewEthPrice(ethPrice, ethPriceChangeWholePc);
	$: newEthValue = liquidated ? 0 : ethSupplyQty * newEthPrice;
	$: interest = getInterestOnLoanInOneYear(borrowAmountUSD, interestRate);
	$: feesPlusInterest = liquidated ? 0 : interest + ambosFee;
	$: ethRemainingIfUserHadSold = getEthValueRemainingIfUserHadSold(
		ethSupplyQty,
		ethPrice,
		percentageChangeInEthPrice * 100,
		borrowAmountUSD
	);
	$: sellEthEquivalent = borrowAmountUSD / ethPrice;
	$: ethHeldAfterSell = ethSupplyQty - sellEthEquivalent;
	$: repay = liquidated ? 0 : borrowAmountUSD + totalFees + interest;
	$: afterRepayment = newEthValue - repay;
	$: loanVsSell = afterRepayment - ethRemainingIfUserHadSold;
	$: totalFees = ambosFee + estimatedNetworkFee;
	$: liquidated = liquidationPrice >= newEthPrice;
	$: showDepositWarning = borrowAmountUSD === maxBorrow && ethSupplyQty < ethMaxValue;

	$: {
		if (borrowAmountUSD > maxBorrow) {
			borrowAmountUSD = maxBorrow;
		}
	}

	async function tryQuoteFromCache() {
		const key = LOCAL_STORAGE_KEYS.CACHED_GET_ETH_PRICE;
		const expiry = 5 * 60 * 1000; // 5 minutes
		try {
			ethPrice = await cacheFetch(key, expiry, async () => {
				const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
				const response = await fetch(url);
				const json = await response.json();
				return json.ethereum.usd;
			});
		} catch (e) {
			console.error('Error estimating fees', e);
		}
	}

	onMount(() => {
		tryQuoteFromCache();
	});

	function handleClick() {
		goto('/calculator/v2/borrow?ethSupplyQty=' + ethSupplyQty);
	}
</script>

<section>
	<div class="p-4 flex flex-col gap-5">
		<Card variant="popover" padding="base" class="flex flex-col gap-5 relative pt-6">
			<div class="w-full flex items-center justify-center">
				<img src="/illustrations/calculator.png" alt="calculator" class="h-32 w-32" />
			</div>
			<div class="flex w-full justify-between text-center">
				<p class="text-base md:text-lg font-bold w-full">
					Unlock the Full Potential Of Your Crypto
				</p>
			</div>
			<p class="text-center px-4">
				Tap into the power of your ETH holdings without letting go. Enter your $ETH amount and
				explore the USD you can receive instantly for your pressing needs or next big opportunity,
				while your crypto continues to grow for the future.
			</p>

			<div class="flex w-full justify-between items-center pl-2">
				<div class="flex grow items-center text-xs gap-1 justify-center">
					<p class="ml-2 font-bold whitespace-nowrap">Powered by</p>
					<img src="/external/aave.png" alt="aave logo" class="h-12" />
				</div>
				<p class="text-xs md:text-sm w-full text-end">
					{f(ethPrice)} / ETH
				</p>
			</div>
		</Card>
		<Card class="py-10 px-4 text-center bg-popover">
			<CardContent class="flex flex-col gap-5">
				<!-- Eth Supply -->
				<div class="-mb-10">
					<InputEditSlider
						title="How much ETH do you want to deposit?"
						max={ethMaxValue}
						showMax={true}
						maxFormatter={(m) => `${e(m)} ETH`}
						showRange={true}
						step={0.01}
						bind:value={ethSupplyQty}
						formatter={() => `${ethSupplyQty} ETH`}
					>
						<div slot="tooltip">
							<TooltipIcon text={TOOLTIPS.ETH_DEPOSIT} />
						</div>
						<div slot="below-input-left" class="text-xs md:text-sm flex justify-between">
							<div class="flex gap-1">
								<p class="font-bold">Value:</p>
								<p>{f(depositUSDValue)}</p>
							</div>
						</div>
					</InputEditSlider>
					<Button class="w-72 max-w-[75%] text-lg" on:click={handleClick}>Calculate Earnings</Button
					>
				</div>
			</CardContent>
		</Card>
	</div>
	<div class="flex justify-center w-full text-center px-4 pt-10">
		<div class="p-4 flex flex-col gap-2 w-full">
			<p class="text-xl font-extrabold">DISCLAMER</p>

			<p class="text-muted-foreground">
				This calculator is for illustrative purposes only. It is not intended to be a substitute for
				professional financial advice. While every attempt has been made to ensure that the
				calculations presented here are representative, Ambos Finance does not guarantee the
				accuracy of the calculations or their applicability to your circumstances. <br />As always,
				do your own research: taking out a loan in any circumstance involves risk, and, especially
				in DeFi, it's important to understand these risks.
			</p>
		</div>
	</div>
</section>
