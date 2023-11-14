<script lang="ts">
	import { e, f, pc } from '$lib/utils';
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Range from '$lib/components/range/range.svelte';
	import CalculatorBars from '$lib/components/charts/calculatorBars.svelte';
	import { LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
	import {
		getEthValue,
		getEthValueRemainingIfUserHadSold,
		getAmbosFee,
		getLiquidationPrice,
		getMaxBorrow,
		getPercentageEthPriceChange,
		getInterestOnLoanInOneYear,
		getNewEthPrice
	} from '$lib/components/calculator/calculator';
	import { cacheFetch } from '$lib/cache';
	import { getBorrowAmountUSD, getEthPriceChange, getEthSupplyQty } from '../utils';
	import { goto } from '$app/navigation';
	import Layout from '../Layout.svelte';

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

	$: {
		if (borrowAmountUSD > maxBorrow) {
			borrowAmountUSD = maxBorrow;
		}
	}

	$: {
		if (ethPriceChangeWholePc < -100) {
			ethPriceChangeWholePc = -100;
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

	function handleBack() {
		goto(
			ROUTES.CALCULATOR_V2_BORROW +
				'?ethSupplyQty=' +
				ethSupplyQty +
				'&borrowAmountUSD=' +
				borrowAmountUSD
		);
	}

	onMount(async () => {
		await tryQuoteFromCache();

		ethSupplyQty = getEthSupplyQty() ?? ethSupplyQty;
		borrowAmountUSD = getBorrowAmountUSD() ?? borrowAmountUSD;
		ethPriceChangeWholePc = getEthPriceChange() ?? ethPriceChangeWholePc;
	});
</script>

<Layout>
	<span slot="banner">
		<Card
			variant="popover"
			padding="base"
			class="flex flex-col gap-5 relative p-6 text-center mb-10"
		>
			<p class="text-lg font-bold">Choose How Much USD You Want</p>
			<p>
				Your crypto can work for you. Borrow USD against your ETH at competitive rates without
				selling your assets
			</p>
		</Card>
	</span>

	<section>
		<div class="flex flex-col gap-5">
			<!-- Simulate results -->
			<Card class=" text-center bg-popover p-4">
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
								{#if percentageChangeInEthPrice > 0}+{/if}{(
									percentageChangeInEthPrice * 100
								).toFixed(2)}%
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
										<br />You cannot reclaim your deposited ETH, but you also no longer need to
										repay your loan
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

				<div class="w-full flex flex-col gap-5 px-5">
					<Button
						target="_blank"
						href="https://discord.gg/hhXMdH8QKW"
						variant="secondary"
						class="rounded-2xl">Get Up to $300 in Fees Credit*</Button
					>
					<p class="text-sm text-muted-foreground">
						*The offer is limited to users that take out loans of a minimum of $1000 and maximum of
						$60,000. 50% of the fee paid on the loan will be credited back into your account. Head
						over to our <a href={'https://discord.gg/hhXMdH8QKW'} target="_blank">discord</a> to activate
						the offer.
					</p>
					<div class="w-full flex gap-2 text-lg">
						<Button
							on:click={handleBack}
							variant="outline"
							class="border-secondary text-secondary grow w-1/2">Back</Button
						>
						<Button
							target="_blank"
							href="https://ambos.finance?openSignupForm=true"
							class="w-1/2 text-lg">Sign Up</Button
						>
					</div>
				</div>
			</Card>
		</div>
	</section>
</Layout>
