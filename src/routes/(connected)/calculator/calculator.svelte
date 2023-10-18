<script lang="ts">
	import { e, f, pc } from '$lib/utils';
	import * as Accordion from '$lib/components/ui/accordion';
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Range from '$lib/components/range/range.svelte';
	import CalculatorBars from '$lib/components/charts/calculatorBars.svelte';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants';
	import InputEditSlider from '../loans/review/input-edit-slider.svelte';
	import {
		getEthValue,
		getEthValueRemainingIfUserHadSold,
		getFeesAndCharges,
		getLiquidationPrice,
		getMaxBorrow,
		getMinimumDepositValue,
		getPercentageEthPriceChange,
		getReturnsAfterInterestAndFees
	} from './calculator';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import {
		setBorrowUsd,
		setIncreaseDebtBuilderStage,
		setSupplyEth
	} from '$stores/transactions/builders';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { getBorrowFeeQuote } from '$stores/transactions/fees';

	let ethMaxValue = 10;
	let ethSupplyQty = 5;
	let borrowAmount = 1000;
	let ethPriceChangeWholePc = 20; // Initial value
	let newEthPrice = 0;
	let interestRate = 0.05; // 5%
	let web3Store = getWeb3Store();
	let txStore = getTxStore();
	let accountStore = getAccountStore();
	let estimatedNetworkFee = 0.01;

	// Computed values
	$: ethPrice = $web3Store.ethPrice.small ?? 0;
	$: maxBorrow = getMaxBorrow(ethSupplyQty, ethPrice);
	$: maxLTV = $web3Store.poolReserveData.ltv.small ?? 0;
	$: liquidationPrice = getLiquidationPrice(ethSupplyQty, borrowAmount, maxLTV);
	$: minDepositValue = getMinimumDepositValue(liquidationPrice, ethSupplyQty);
	$: depositUSDValue = getEthValue(ethSupplyQty, ethPrice);
	$: feesAndCharges = getFeesAndCharges(depositUSDValue);
	$: percentageChangeInEthPrice = getPercentageEthPriceChange(ethPrice, newEthPrice);
	$: newEthPrice = ethPrice * (1 + ethPriceChangeWholePc / 100);
	$: newEthValue = ethSupplyQty * newEthPrice;
	$: returnsAfterInterestAndFees = getReturnsAfterInterestAndFees(
		ethSupplyQty,
		percentageChangeInEthPrice,
		newEthPrice,
		interestRate,
		borrowAmount
	);
	$: ethRemainingIfUserHadSold = getEthValueRemainingIfUserHadSold(
		ethSupplyQty,
		ethPrice,
		percentageChangeInEthPrice,
		borrowAmount
	);
	$: liquidated = liquidationPrice >= newEthPrice;
	$: returnIncludingLiquidation = liquidated
		? returnsAfterInterestAndFees - newEthValue
		: returnsAfterInterestAndFees;
	$: borrowAmountEthEquivalent = borrowAmount / ethPrice;
	$: smartAccount = $accountStore.smartAccount;
	$: provider = $accountStore.provider;

	$: {
		if (borrowAmount > maxBorrow) {
			borrowAmount = maxBorrow;
		}
	}

	$: {
		if (smartAccount && provider) {
			getBorrowFeeQuote({ smartAccount, provider })
				.then((quote) => {
					estimatedNetworkFee = quote.small;
				})
				.catch((err) => {
					console.log('Error estimating fees', err);
				});
		}
	}

	onMount(() => {
		setIncreaseDebtBuilderStage(txStore, 'calculate');
	});

	function handleStartBorrowing() {
		setSupplyEth(txStore, ethSupplyQty);
		setBorrowUsd(txStore, borrowAmount);
		goto(ROUTES.LOANS_V2_TRANSFER);
	}
</script>

<!-- <Faq /> -->

<div class="p-4 flex flex-col gap-5 pb-20">
	<Card class=" text-center bg-popover">
		<CardContent class="flex flex-col gap-5">
			<!-- Eth Supply -->
			<div class="py-4">
				<InputEditSlider
					title="How much ETH do you want to deposit?"
					max={ethMaxValue}
					showRange={true}
					step={0.01}
					bind:value={ethSupplyQty}
					formatter={() => {
						return `${e(ethSupplyQty)} - ${e(ethMaxValue)} ETH`;
					}}
				/>
			</div>
			<!-- USD Borrow -->
			<div>
				<InputEditSlider
					title="How much USD do you want to borrow?"
					showRange={true}
					max={maxBorrow}
					step={0.01}
					bind:value={borrowAmount}
					formatter={() => {
						return `${f(borrowAmount)} - ${f(maxBorrow)}`;
					}}
				/>
				<p class="text-xs text-muted-foreground py-3">Increase the ETH deposit to borrow more</p>
			</div>
			<!-- Stats -->
			<section class="text-xs flex flex-col gap-3">
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
				<Accordion.Root class="flex w-full justify-between bg-background rounded-2xl px-3 py-2">
					<Accordion.Item value="item-1" class="w-full">
						<Accordion.Trigger class="w-full">
							<div class="font-bold">Est. Fees & Charges</div>
							<div slot="trigger-right">
								{f(feesAndCharges.total)}
								<span class="pl-1 text-muted-foreground"
									>{pc(feesAndCharges.percentOfBorrowed)}</span
								>
							</div>
						</Accordion.Trigger>
						<Accordion.Content>
							<div class="pt-2">
								<div class="flex w-full justify-between">
									<p>Ambos Fee</p>
									<div>
										<p>{f(feesAndCharges.ambosFee)}</p>
									</div>
								</div>
								<div class="flex w-full justify-between">
									<p>Est. Exchange Fees</p>
									<div>
										<p>{f(feesAndCharges.exchangeFee)}</p>
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

				<Button class="w-full rounded-xl mt-2 py-6 text-base" on:click={handleStartBorrowing}
					>Start Borrowing Now!</Button
				>
				<Button variant="link" class="pb-0">Check out the loan terms</Button>
			</section>
		</CardContent>
	</Card>

	<!-- Simulate results -->
	<Card class=" text-center bg-popover mb-10">
		<CardContent class="flex flex-col gap-5">
			<div class="py-4 flex flex-col gap-2">
				<p class="font-extrabold text-md tracking-widest">Simulate Results</p>
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
						{#if percentageChangeInEthPrice > 0}
							+
						{/if}
						{pc(percentageChangeInEthPrice * 100)}
					</span>
				</Button>
			</div>
			<!-- Sim stats -->
			<div class="bg-background rounded-xl px-2 py-3 text-xs flex flex-col gap-2">
				<div class="flex justify-between">
					<p class="font-bold">You deposited</p>
					<p>{f(depositUSDValue)}</p>
				</div>
				<div class="flex justify-between">
					<p class="font-bold">You borrowed</p>
					<p class="text-destructive">{f(borrowAmount)}</p>
				</div>
				<div class="flex justify-between">
					<p class="font-bold">
						Total {returnsAfterInterestAndFees > 0 ? 'Profit - including fees' : 'Loss'}
					</p>
					<p class={returnsAfterInterestAndFees > 0 ? 'text-primary' : 'text-destructive'}>
						{f(returnIncludingLiquidation)}
					</p>
				</div>
			</div>
			<div class="h-72">
				<CalculatorBars
					{liquidated}
					borrowed={borrowAmount}
					ethRemaining={newEthValue}
					ethIfYouSold={ethRemainingIfUserHadSold}
				/>
				<div />
			</div>
			<div class="bg-background text-xs rounded-xl px-3 py-2 text-center">
				{#if liquidated}
					You <span class="font-bold">borrowed {f(borrowAmount)}</span> in USD, but
					<span class="text-red-500">your ETH was liquidated</span>
					to cover lenders. You no longer have to repay your loan, but you cannot claim your deposit
					back.
					<br />
					<br />
				{/if}
				For comparison, if you had sold {e(borrowAmountEthEquivalent)} of ETH instead of borrowing {f(
					borrowAmount
				)}, you'd have {f(ethRemainingIfUserHadSold)} in ETH remaining.
			</div>
		</CardContent>
	</Card>
</div>
