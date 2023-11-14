<script>
	import { e, f, pc } from '$lib/utils';
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import {
		getAmbosFee,
		getLiquidationPrice,
		getMaxBorrow,
		getMinimumDepositValue,
		getNewEthPrice
	} from '$lib/components/calculator/calculator';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { cacheFetch } from '$lib/cache';
	import { goto } from '$app/navigation';
	import * as Accordion from '$lib/components/ui/accordion';
	import { getBorrowAmountUSD, getEthSupplyQty } from '../utils';
	import Layout from '../Layout.svelte';

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
	$: ambosFee = getAmbosFee(borrowAmountUSD);
	$: newEthPrice = getNewEthPrice(ethPrice, ethPriceChangeWholePc);

	$: totalFees = ambosFee + estimatedNetworkFee;
	$: showDepositWarning = borrowAmountUSD === maxBorrow && ethSupplyQty < ethMaxValue;
	$: feePercent = borrowAmountUSD === 0 ? 0 : (totalFees / borrowAmountUSD) * 100;

	$: {
		if (borrowAmountUSD > maxBorrow) {
			borrowAmountUSD = maxBorrow;
		}
	}

	function handleBack() {
		goto(ROUTES.CALCULATOR_V2_START + '?ethSupplyQty=' + ethSupplyQty);
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

	onMount(async () => {
		await tryQuoteFromCache();

		ethSupplyQty = getEthSupplyQty() ?? ethSupplyQty;
		borrowAmountUSD = getBorrowAmountUSD() ?? borrowAmountUSD;
	});

	function handleSimulateResults() {
		goto('simulate?ethSupplyQty=' + ethSupplyQty + '&borrowAmountUSD=' + borrowAmountUSD);
	}
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

	<Card class="p-6 text-center bg-popover">
		<CardContent class="flex flex-col gap-5">
			<div>
				<p class="font-bold text-lg pb-5">How Much USD Would You Like To Borrow?</p>
				<InputEditSlider
					title="Borrow Quantity"
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

				<!-- Fees and Charges -->
				<Accordion.Root
					class="flex w-full justify-between bg-background rounded-2xl px-3 py-2 text-xs"
				>
					<Accordion.Item value="item-1" class="w-full">
						<Accordion.Trigger class="w-full">
							<div class="font-bold">Est. Fees & Charges</div>
							<div slot="trigger-right">
								{f(totalFees ?? 0)}
								<span class="pl-1 text-muted-foreground">{pc(feePercent)}</span>
							</div>
						</Accordion.Trigger>
						<Accordion.Content>
							<div class="pt-2 text-xs">
								<div class="flex w-full justify-between">
									<p>Ambos Fee</p>
									<div>
										<p>{f(ambosFee)}</p>
									</div>
								</div>
								<div class="flex w-full justify-between">
									<p>Est. Network Fees</p>
									<div>
										<p>{f(estimatedNetworkFee)}</p>
									</div>
								</div>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</section>
		</CardContent>
		<div class="w-full flex gap-2 text-lg px-5">
			<Button
				on:click={handleBack}
				variant="outline"
				class="border-secondary text-secondary grow w-1/2">Back</Button
			>
			<Button on:click={handleSimulateResults} class="grow w-1/2">Simulate Results</Button>
		</div>
	</Card>
</Layout>
