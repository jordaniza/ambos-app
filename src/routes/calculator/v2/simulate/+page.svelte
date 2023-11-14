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
</script>

<section>
	<div class="p-4 flex flex-col gap-5 pb-20">
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
		<!-- Simulate results -->
		<Card class=" text-center bg-popover">
			<CardContent class="flex flex-col gap-5">
				<div class="py-4 flex flex-col gap-2">
					<p class="font-extrabold text-md">Simulate Results</p>
					<p class="tracking widest">ETH price in 1 year</p>

					<div class="py-3">
						<Range bind:value={newEthPrice} max={3 * ethPrice} step={1} />
					</div>
					<Button
						variant="outline"
						class="border-secondary bg-popover shadow-md py-6 w-full font-bold"
						>{f(newEthPrice)}
						<span
							class={(newEthPrice >= ethPrice ? 'text-primary' : 'text-destructive') +
								' font-thin pl-2'}
						>
							{#if percentageChangeInEthPrice > 0}+{/if}{(percentageChangeInEthPrice * 100).toFixed(
								2
							)}%
						</span>
					</Button>
				</div>
				<!-- Sim stats -->
				<div class="flex flex-col gap-5 text-start text-xs md:text-sm">
					<!-- If you Borrowed -->
					<div class="flex flex-col gap-1">
						<p class="pl-2">If You Borrowed:</p>
						<div class="bg-background rounded-xl px-2 py-3 flex flex-col gap-2">
							<div class="flex justify-between">
								<p class="font-bold">You deposited</p>
								<p>{f(depositUSDValue)} / {e(ethSupplyQty)} ETH</p>
							</div>
							<div class="flex justify-between">
								<p class="font-bold">You borrowed</p>
								<p>{f(borrowAmountUSD)}</p>
							</div>
							<div class="flex justify-between">
								<p class="font-bold">Supplied ETH is Worth</p>
								<p>{f(newEthValue)}</p>
							</div>
							<div class="flex justify-between">
								<p class="font-bold">Fees + Interest</p>
								<p class="text-destructive">{f(feesPlusInterest)}</p>
							</div>
							<div class="flex justify-between">
								<p class="font-bold">ETH value after repay</p>
								<p class={afterRepayment > 0 ? 'text-primary' : 'text-destructive'}>
									{f(afterRepayment)}
								</p>
							</div>
						</div>
					</div>

					<!-- if You Sold -->
					<div class="flex flex-col gap-1">
						<p class="pl-2">If You Sold:</p>
						<div class="bg-background rounded-xl px-2 py-3 flex flex-col gap-2">
							<div class="flex justify-between">
								<p class="font-bold">You Sold</p>
								<p>{f(borrowAmountUSD)} / {e(sellEthEquivalent)} ETH</p>
							</div>
							<div class="flex justify-between">
								<p class="font-bold">You Held</p>
								<p>{e(ethHeldAfterSell)} ETH</p>
							</div>
							<div class="flex justify-between">
								<p class="font-bold">Held ETH is Worth</p>
								<p>{f(ethRemainingIfUserHadSold)}</p>
							</div>
						</div>
					</div>

					<!-- Comparison -->
					<div class="flex flex-col gap-1">
						<p class="pl-2">Comparison:</p>
						<div class="bg-background rounded-xl px-2 py-3 flex flex-col gap-2">
							<div class="flex justify-between">
								<p class="font-bold">Borrow vs. Sell</p>
								<p class={loanVsSell > 0 ? 'text-primary' : 'text-destructive'}>
									{f(loanVsSell)}
								</p>
							</div>
							{#if liquidated}
								<p class="text-xs">
									<span class="font-bold text-destructive"> You were liquidated. </span>
									<br />You cannot reclaim your deposited ETH, but you also no longer need to repay
									your loan
								</p>
							{/if}
						</div>
					</div>

					<!-- Bars -->
					<div class="h-72">
						<CalculatorBars
							{liquidated}
							borrowed={borrowAmountUSD}
							ethRemaining={newEthValue}
							ethIfYouSold={ethRemainingIfUserHadSold}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
</section>
