<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { e, f, getBarColor, getLiquidationPrice, getTextColor, pc, stbl } from '$lib/utils';
	import { CreditCardIcon, DollarSign, GemIcon, LockIcon, ReceiptIcon } from 'lucide-svelte';
	import TopBar from '../dashboard/top-bar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { getWeb3Store } from '$lib/context/getStores';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import RepaySelect from './(repay)/repay-select.svelte';
	import { goto } from '$app/navigation';
	import { LEARN_LIQUIDATIONS, ROUTES } from '$lib/constants';
	import EthPriceTicker from '$lib/components/charts/eth-price-ticker.svelte';
	import Remove from './(remove)/remove.svelte';

	let openRepay = false;
	let openRemove = false;
	let web3Store = getWeb3Store();

	$: interestRate = ($web3Store.poolReserveData['USDC'].variableBorrowingRate.small ?? 0) * 100;
	$: borrowed = $web3Store.userPoolData.totalDebtBase.small ?? 0;
	$: supplied = $web3Store.balances['aWETH'].small ?? 0;
	$: ethPrice = $web3Store.ethPrice.small ?? 0;
	$: suppliedValue = supplied * ethPrice ?? 0;
	$: maxLTV = $web3Store.userPoolData.ltv.small ?? 0;
	$: loanLQPercentage = getLoanLiquidationPercentage(borrowed, suppliedValue, maxLTV);
	$: liquidationPrice = getLiquidationPrice(borrowed, supplied, maxLTV);
	$: barWidth = loanLQPercentage * 100;
	$: barStyle = getBarColor(barWidth) + ' rounded-full h-full';
	$: borrowText = borrowed > 0 ? 'Borrow More' : 'Start Borrowing';
	$: liquidationRiskTextColor = getTextColor(barWidth);

	function getLoanLiquidationPercentage(borrowed: number, supplied: number, maxLTV: number) {
		if (borrowed === 0 || maxLTV === 0) return 0;
		// first get the borrowed out of supplied
		const borrowedOutOfSupplied = borrowed / supplied;
		// now we need that as a percentage of the maxLTV
		return borrowedOutOfSupplied / maxLTV;
	}

	function handleClickRemoveETH() {
		openRemove = true;
	}

	function getLiquidationStatus(liquidationPercentage: number): string {
		if (liquidationPercentage < 0.5) {
			return 'Low';
		} else if (liquidationPercentage < 0.7) {
			return 'Medium';
		} else {
			return 'High';
		}
	}
</script>

<RepaySelect bind:open={openRepay} />
<Remove bind:open={openRemove} />

<!-- <Faq /> -->
<TopBar page="Manage Your Loan" />
<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans-2.png')]"
	/>

	<span slot="header" class="-mt-4">
		<h1 class=" pb-1">Current Amount Borrowed</h1>
		<h2 class="text-3xl">{f(borrowed)}</h2>
	</span>

	<div slot="card">
		<div class="transform -translate-y-16 flex flex-col gap-4 p-4">
			<Card variant="popover" padding="base" class="flex flex-col gap-3 py-4 text-sm">
				<!-- header -->
				<div class="flex w-full justify-between">
					<div class="flex items-center gap-3">
						<LockIcon class="text-muted-foreground h-4 w-4" />
						<p class="font-bold">Supplied</p>
					</div>
					<TooltipIcon text={TOOLTIPS.ETH_SUPPLIED} />
				</div>
				<!-- Eth -->
				<div class="flex justify-between items-center gap-2">
					<div class="flex items-center gap-2">
						<div class="h-10 w-10 bg-background rounded-full flex items-center justify-center">
							<img class="h-8 w-8" src="/external/eth.png" alt="ETH" />
						</div>
						<div>
							<p class="font-bold">Ether</p>
							<div class="flex text-xs items-center">
								<EthPriceTicker />
							</div>
						</div>
					</div>
					<div>
						<p class="font-bold text-right">{e(supplied)} ETH</p>
						<p class="text-sm">{f(suppliedValue)}</p>
					</div>
				</div>
				<section class="flex gap-2">
					<Button on:click={handleClickRemoveETH} variant="outline" class="w-1/2 text-primary"
						>Remove ETH</Button
					>
					<Button disabled={true} class="w-1/2">Add ETH</Button>
				</section>
			</Card>
			<!-- Borrowed -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-2 py-4">
				<div class="flex justify-between items-center">
					<div class="flex gap-2 items-center justify-start">
						<CreditCardIcon class="text-muted-foreground h-4 w-4" />
						<p class=" font-bold pt-[1.5px]">Borrowed</p>
					</div>
					<TooltipIcon text={TOOLTIPS.USD_BORROWED} />
				</div>
				<div class="flex justify-between items-center gap-2">
					<div class="flex items-center gap-2">
						<div class="h-10 w-10 bg-background rounded-full flex items-center justify-center">
							<DollarSign class="text-secondary stroke-2 h-7 w-7" />
						</div>
						<div>
							<p class="font-bold">USDC</p>
						</div>
					</div>
					<div class="text-end">
						<p class="font-bold">{stbl(borrowed, 'USDC')}</p>
						<p class="text-sm">{f(borrowed)}</p>
					</div>
				</div>
				<div class="flex justify-between items-center">
					<p>Interest Rate</p>
					<p>{pc(interestRate)}</p>
				</div>
				<Button on:click={() => goto(ROUTES.LOANS_V2_CALCULATE)}>{borrowText}</Button>
			</Card>
			<!-- Loan Health -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-2 py-4">
				<div class="flex justify-between items-center">
					<div class="flex gap-2 items-center justify-start">
						<GemIcon class="text-muted-foreground h-4 w-4" />
						<p class=" font-bold pt-[1.5px]">Loan Health</p>
					</div>
					<TooltipIcon text={TOOLTIPS.LOAN_HEALTH} />
				</div>
				<div class="flex items-center">
					<div class="flex-shrink mr-2 w-full items-center justify-center">
						<div class="bg-gray-200 rounded-full h-2 w-full relative">
							<div class={barStyle} style={`width: ${barWidth}%;`} />
						</div>
					</div>
					<p class="text-secondary">{Math.floor(barWidth)}%</p>
				</div>
				<div class="flex justify-between items-center gap-2">
					<div class="flex justify-between items-center w-full">
						<p>Risk of Liquidation</p>
						<p class={liquidationRiskTextColor}>{getLiquidationStatus(loanLQPercentage)}</p>
					</div>
				</div>
				<div class="flex justify-between items-center w-full">
					<p>Liquidation Price</p>
					<p>{f(liquidationPrice)} / ETH</p>
				</div>
				<Separator />
				<div class="flex flex-col items-start -mb-2">
					<p class="text-xs text-muted-foreground">
						Keep maintaining a healthy LTV to avoid liquidation, monitor your loan regularly.

						<a class="text-secondary underline pl-[1px]" href={LEARN_LIQUIDATIONS} target="_blank"
							>Learn More</a
						>
					</p>
				</div>
			</Card>
			<!-- Repay Loan -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-2 py-4">
				<div class="flex justify-between items-center">
					<div class="flex gap-2 items-center justify-start">
						<ReceiptIcon class="text-muted-foreground h-4 w-4" />
						<p class=" font-bold pt-[1.5px]">Repay Loan</p>
					</div>
					<TooltipIcon text={TOOLTIPS.LOAN_REPAY} />
				</div>
				<div class="flex justify-between items-center gap-2">
					<div class="flex justify-between items-center w-full">
						<p>Outstanding Amount:</p>
						<p class="text-secondary">{f(borrowed)}</p>
					</div>
				</div>
				<!-- <div class="flex justify-between items-center w-full">
					<p>Interest:</p>
					<p class="text-secondary">{f(400)}</p>
				</div>
				<div class="flex justify-between items-center w-full">
					<p>Repaid:</p>
					<p>{f(2000.45)}</p>
				</div> -->
				<Separator />
				<div class="flex flex-col gap-1 pt-3">
					<Button
						variant="outline"
						class="border-secondary text-secondary"
						on:click={() => (openRepay = true)}>Repayment Options</Button
					>
				</div>
			</Card>
			<!-- Loan History -->
			<!-- <Card variant="popover" padding="base" class="flex text-sm flex-col gap-4 py-4 mb-20">
				<div class="flex justify-between items-center">
					<div class="flex gap-3 items-center justify-start">
						<HistoryIcon class="text-muted-foreground h-4 w-4" />
						<p class=" font-bold pt-[1.5px]">Loan History</p>
					</div>
				</div>
				{#each historyItems as item}
					<Card padding="base" class="flex flex-col shadow-none justify-between items-center gap-2">
						<div class="flex justify-between items-center w-full text-muted-foreground">
							<p>{toProperCase(item.action)}</p>
							<p>{formatTimestamp(item.timestamp)}</p>
						</div>
						<div class="flex justify-between items-center w-full">
							<p>{item.currency}</p>
							<p>{f(item.usdValue)}</p>
						</div>
					</Card>
				{/each}
			</Card> -->
		</div>
	</div>
</BaseScreen>
