<script lang="ts">
	import { e, f, pc } from '$lib/utils';
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Range from '$lib/components/range/range.svelte';
	import CalculatorBars from '$lib/components/charts/calculatorBars.svelte';
	import { goto } from '$app/navigation';
	import { INTEREST_RATES, LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
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
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import {
		setBorrowUsd,
		setIncreaseDebtBuilderStage,
		setSupplyEth
	} from '$stores/transactions/builders';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { getBorrowFeeQuote } from '$stores/transactions/fees';
	import type { BiconomySmartAccountV2 } from '@biconomy/account';
	import type { AppProvider } from '$stores/account';
	import { cacheFetch } from '$lib/cache';
	import FeesAndCharges from './fees-and-charges.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { GhostIcon, InfoIcon } from 'lucide-svelte';

	let ethMaxValue = 10;
	let ethSupplyQty = 5;
	let borrowAmountUSD = 1000;
	let ethPriceChangeWholePc = 20; // Initial value
	let newEthPrice = 0;
	let web3Store = getWeb3Store();
	let txStore = getTxStore();
	let accountStore = getAccountStore();
	let estimatedNetworkFee = 0.01;
	let dialogOpen = false;

	// Computed values
	$: ethPrice = $web3Store.ethPrice.small ?? 0;
	$: maxBorrow = getMaxBorrow(ethSupplyQty, ethPrice);
	$: maxLTV = $web3Store.poolReserveData['WETH'].ltv.small ?? 0;
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
	$: smartAccount = $accountStore.smartAccount;
	$: provider = $accountStore.provider;
	$: showDepositWarning = borrowAmountUSD === maxBorrow && ethSupplyQty < ethMaxValue;
	$: savedEthToSupply = $txStore.builders.INCREASE_DEBT.ethToSupply ?? 0;
	$: savedUSDToBorrow = $txStore.builders.INCREASE_DEBT.usdToBorrow ?? 0;
	$: isDisabled = ethSupplyQty === 0 || borrowAmountUSD === 0;
	$: interestRate = ($web3Store.poolReserveData['USDC'].variableBorrowingRate.small ?? 0) * 100;

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

	async function tryQuoteFromCache(smartAccount: BiconomySmartAccountV2, provider: AppProvider) {
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
		if (savedEthToSupply > 0) {
			ethSupplyQty = savedEthToSupply;
		}
		if (savedUSDToBorrow > 0) {
			borrowAmountUSD = savedUSDToBorrow;
		}

		setIncreaseDebtBuilderStage(txStore, 'calculate');
	});
</script>

<Dialog.Root open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[425px] text-center">
		<div class="flex w-full justify-center">
			<GhostIcon class="w-16 h-16 inline-block text-secondary stroke-1 " />
		</div>
		<p>
			Interest rates on Ambos are variable and change over time, depending on how much demand there
			is for loans. A high figure now will often not stay high for very long. Please see the Ambos
			and Aave docs for more details.
		</p>
		<Button variant="link">
			<a href={INTEREST_RATES} target="_blank" rel="noopener noreferrer">
				Learn more about interest rates on Aave and Ambos
			</a>
		</Button>
		<Dialog.Footer>
			<Button on:click={() => (dialogOpen = false)}>Understood</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

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
					formatter={() => `${ethSupplyQty} ETH`}
				>
					<div slot="tooltip">
						<TooltipIcon text={TOOLTIPS.ETH_DEPOSIT} />
					</div>
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
			<!-- Stats -->
			<section class="text-xs flex flex-col gap-3">
				<!-- Min Deposit value && interet rate -->
				<div class="flex w-full gap-2">
					<div class="bg-background w-1/2 rounded-2xl px-3 py-2 text-left">
						<p class="font-bold">Min Deposit Value</p>
						<p>{f(minDepositValue)}</p>
					</div>
					<div class="bg-background w-1/2 rounded-2xl px-3 py-2 text-left">
						<div class="flex w-full justify-between">
							<p class="font-bold">Interest Rate</p>
							<button on:click={() => (dialogOpen = true)}>
								<InfoIcon class="w-4 h-4 inline-block text-muted-foreground" />
							</button>
						</div>
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

				<FeesAndCharges bind:borrowAmountUSD />

				<Button
					class="w-full rounded-xl p-6 text-base"
					disabled={isDisabled}
					on:click={handleStartBorrowing}>Start Borrowing Now!</Button
				>
				<div class="flex justify-center items-center -my-4">
					<p>Powered by</p>
					<img src="/external/aave.png" alt="Aave" class="w-20 inline-block" />
				</div>
			</section>
		</CardContent>
	</Card>

	<!-- Simulate results -->
	<Card class=" text-center bg-popover mb-10">
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
			<div class="flex flex-col gap-5 text-start">
				<!-- If you Borrowed -->
				<div class="flex flex-col gap-1">
					<p class="pl-2">If You Borrowed:</p>
					<div class="bg-background rounded-xl px-2 py-3 text-xs flex flex-col gap-2">
						<div class="flex justify-between">
							<p class="font-bold">You deposited</p>
							<p>{f(depositUSDValue)} / {e(ethSupplyQty)} ETH</p>
						</div>
						<div class="flex justify-between">
							<p class="font-bold">You borrowed</p>
							<p>{f(borrowAmountUSD)}</p>
						</div>
						<div class="flex justify-between">
							<p class="font-bold">Deposited ETH is Worth</p>
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
					<p class="pl-2">Comparison:</p>
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
