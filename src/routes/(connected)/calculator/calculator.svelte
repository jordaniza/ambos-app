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
	import { LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
	import InputEditSlider from '../loans/review/input-edit-slider.svelte';
	import {
		getEthValue,
		getEthValueRemainingIfUserHadSold,
		getAmbosFee,
		getLiquidationPrice,
		getMaxBorrow,
		getMinimumDepositValue,
		getPercentageEthPriceChange,
		getReturnsAfterInterestAndFees,
		getEthValueInOneYear,
		getInterestOnLoanInOneYear,
		getNewEthPrice
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
	import type { BiconomySmartAccount } from '@biconomy/account';
	import type { AppProvider } from '$stores/account';
	import { cacheFetch } from '$lib/cache';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let ethMaxValue = 10;
	let ethSupplyQty = 5;
	let borrowAmountUSD = 1000;
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
	$: feePercent = (totalFees / borrowAmountUSD) * 100;
	$: liquidated = liquidationPrice >= newEthPrice;
	$: smartAccount = $accountStore.smartAccount;
	$: provider = $accountStore.provider;
	$: showDepositWarning = borrowAmountUSD === maxBorrow && ethSupplyQty < ethMaxValue;

	$: {
		if (borrowAmountUSD > maxBorrow) {
			borrowAmountUSD = maxBorrow;
		}
	}

	$: {
		if (smartAccount && provider) {
			tryQuoteFromCache(smartAccount, provider);
		}
	}

	async function tryQuoteFromCache(smartAccount: BiconomySmartAccount, provider: AppProvider) {
		const key = LOCAL_STORAGE_KEYS.CACHED_FEE_DATA_GET_LOAN;
		const expiry = 5 * 60 * 1000; // 5 minutes
		try {
			estimatedNetworkFee = await cacheFetch(key, expiry, async () => {
				const quote = await getBorrowFeeQuote({ smartAccount, provider });
				return quote.small;
			});
		} catch (e) {
			console.error('Error estimating fees', e);
		}
	}

	function handleStartBorrowing() {
		setSupplyEth(txStore, ethSupplyQty);
		setBorrowUsd(txStore, borrowAmountUSD);
		goto(ROUTES.LOANS_V2_TRANSFER);
	}

	onMount(() => {
		setIncreaseDebtBuilderStage(txStore, 'calculate');
	});
</script>

<div class="p-4 flex flex-col gap-5 pb-20">
	<Card class=" text-center bg-popover">
		<CardContent class="flex flex-col gap-5">
			<!-- Eth Supply -->
			<div class="py-4">
				<InputEditSlider
					title="How much ETH do you want to deposit?"
					max={ethMaxValue}
					showMax={true}
					maxFormatter={(m) => `${e(m)} ETH`}
					showRange={true}
					step={0.01}
					bind:value={ethSupplyQty}
					formatter={() => `${e(ethSupplyQty)} - ${e(ethMaxValue)} ETH`}
				>
					<div slot="below-input-left" class="text-xs flex justify-between">
						<div class="flex gap-1">
							<p class="font-bold">Value:</p>
							<p>{f(depositUSDValue)}</p>
						</div>
					</div>
				</InputEditSlider>
			</div>

			<!-- USD Borrow -->
			<div>
				<InputEditSlider
					title="How much USD do you want to borrow?"
					showRange={true}
					max={maxBorrow}
					showMax={true}
					maxFormatter={f}
					step={0.01}
					bind:value={borrowAmountUSD}
					formatter={() => `${f(borrowAmountUSD)} - ${f(maxBorrow)}`}
				/>

				{#if showDepositWarning}
					<p class="text-xs text-destructive">Increase the ETH deposit to borrow more</p>
				{/if}
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
								{f(ambosFee + estimatedNetworkFee)}
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

				<Button class="w-full rounded-xl mt-2 py-6 text-base" on:click={handleStartBorrowing}
					>Start Borrowing Now!</Button
				>
				<!-- <Button variant="link" class="pb-0">Check out the loan terms</Button> -->
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
						{#if percentageChangeInEthPrice > 0}+{/if}{(percentageChangeInEthPrice * 100).toFixed(
							2
						)}%
					</span>
				</Button>
			</div>
			<!-- Sim stats -->
			<div class="flex flex-col gap-5">
				<!-- If you Borrowed -->
				<div class="flex flex-col gap-1">
					<p>If You Borrowed:</p>
					<div class="bg-background rounded-xl px-2 py-3 text-xs flex flex-col gap-2">
						<div class="flex justify-between">
							<p class="font-bold">You deposited</p>
							<p>{f(depositUSDValue)} / {e(ethSupplyQty)} ETH</p>
						</div>
						<div class="flex justify-between">
							<p class="font-bold">You borrowed</p>
							<p class="text-destructive">{f(borrowAmountUSD)}</p>
						</div>
						<Separator />
						<div class="flex justify-between">
							<p class="font-bold">Supplied ETH is Worth</p>
							<p>{f(newEthValue)}</p>
						</div>
						<div class="flex justify-between">
							<p class="font-bold">Fees + Interest</p>
							<p class="text-destructive">{f(feesPlusInterest)}</p>
						</div>
						<Separator />
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
					<p>If You Sold:</p>
					<div class="bg-background rounded-xl px-2 py-3 text-xs flex flex-col gap-2">
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
					<p>Comparison:</p>
					<div class="bg-background rounded-xl px-2 py-3 text-xs flex flex-col gap-2">
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
