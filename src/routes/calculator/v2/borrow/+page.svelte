<script>
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

<Card class=" text-center bg-popover">
	<CardContent class="flex flex-col gap-5">
		<div>
			<InputEditSlider
				title="How much USD do you want to borrow?"
				showRange={true}
				max={maxBorrow}
				showMax={true}
				maxFormatter={f}
				step={0.01}
				bind:value={borrowAmountUSD}
				formatter={() => f(borrowAmountUSD)}
			>
				<div slot="tooltip">
					<TooltipIcon text={TOOLTIPS.USD_BORROWED} />
				</div>
			</InputEditSlider>

			{#if showDepositWarning}
				<p class="text-xs text-secondary">Increase the ETH deposit if you want to borrow more</p>
			{/if}
		</div>
		<section class="text-xs md:text-sm flex flex-col gap-3">
			<!-- Min Deposit value && interet rate -->
			<div class="flex w-full gap-2">
				<div class="bg-background w-1/2 rounded-2xl px-3 py-2 text-left">
					<p class="font-bold">Min Deposit Value</p>
					<p>{f(minDepositValue)}</p>
				</div>
				<div class="bg-background w-1/2 rounded-2xl px-3 py-2 text-left">
					<p class="font-bold">Interest Rate</p>
					<p>{pc(interestRate ?? 0)}</p>
				</div>
			</div>

			<!-- Liquidation info -->
			<div class="flex w-full justify-between bg-background rounded-2xl px-3 py-2">
				<div class="font-bold">Liquidation Price</div>
				<div class="flex gap-1 text-end">
					<div>{f(liquidationPrice)} / ETH</div>
					<TooltipIcon text={TOOLTIPS.LIQUIDATION_PRICE} />
				</div>
			</div>

			<div class="flex w-full justify-between bg-background rounded-2xl px-3 py-2">
				<div class="font-bold">Ambos Fee</div>
				<div class="flex gap-1 text-end">
					<div>{f(ambosFee)}</div>
					<TooltipIcon text={TOOLTIPS.LIQUIDATION_PRICE} />
				</div>
			</div>
		</section>
	</CardContent>
</Card>
