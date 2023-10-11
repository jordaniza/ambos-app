<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { e, f, getBarColor, getLiquidationPrice, pc } from '$lib/utils';
	import {
		CreditCardIcon,
		DollarSign,
		GemIcon,
		HistoryIcon,
		LockIcon,
		ReceiptIcon
	} from 'lucide-svelte';
	import TopBar from '../dashboard/top-bar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { getWeb3Store } from '$lib/context/getStores';
	import FormatInput from '$lib/components/ui/input/formatInput.svelte';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';

	type HistoryItem = {
		action: string;
		currency: string;
		usdValue: number;
		timestamp: number;
	};

	const now = new Date().getTime();

	const historyItems: HistoryItem[] = [
		{ action: 'supplied', currency: 'ETH', usdValue: 2.34, timestamp: now - 1_000_000 },
		{ action: 'borrowed', currency: 'USDC', usdValue: 4250, timestamp: now - 3_000_000_100 },
		{ action: 'repaid', currency: 'USDC', usdValue: 2000.45, timestamp: now - 10_020_100_000 }
	];

	let priceUp = Math.random() > 0.5;
	let availableBalance = 1500.733434;
	let repayValue = 0;
	let web3Store = getWeb3Store();

	$: interestRate = $web3Store.poolReserveData.variableBorrowingRate.small ?? 0;
	$: borrowed = $web3Store.userPoolData.totalDebtBase.small ?? 0;
	$: supplied = $web3Store.balances['aWETH'].small ?? 0;
	$: ethPrice = $web3Store.ethPrice.small ?? 0;
	$: suppliedValue = supplied * ethPrice ?? 0;
	$: maxLTV = $web3Store.userPoolData.ltv.small ?? 0;
	$: loanLQPercentage = getLoanLiquidationPercentage(borrowed, suppliedValue, maxLTV);
	$: liquidationPrice = getLiquidationPrice(borrowed, supplied, maxLTV);
	$: barWidth = loanLQPercentage * 100;
	$: barStyle = getBarColor(barWidth) + ' rounded-full h-full';

	function formatter(value: number): string {
		return f(value);
	}

	function getLoanLiquidationPercentage(borrowed: number, supplied: number, maxLTV: number) {
		// first get the borrowed out of supplied
		const borrowedOutOfSupplied = borrowed / supplied;
		// now we need that as a percentage of the maxLTV
		return borrowedOutOfSupplied / maxLTV;
	}

	function getLiquidationStatus(liquidationPercentage: number) {
		if (liquidationPercentage < 0.5) {
			return 'Low';
		} else if (liquidationPercentage < 0.7) {
			return 'Medium';
		} else {
			return 'High';
		}
	}

	function useMaxRepay(): void {
		repayValue = Math.min(availableBalance, borrowed);
	}

	// capitalise first letter of every word and lower case the rest
	function toProperCase(str: string): string {
		return str.replace(
			/\w\S*/g,
			(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
		);
	}

	function formatTimestamp(timestamp: number): string {
		const date = new Date(timestamp);

		// Extracting the month, day, and year
		const month = date.toLocaleDateString('en-US', { month: 'long' });
		const day = date.toLocaleDateString('en-US', { day: '2-digit' });
		const year = date.getFullYear();

		// Extracting the hour and minute with padding for single digits
		const hour = String(date.getHours()).padStart(2, '0');
		const minute = String(date.getMinutes()).padStart(2, '0');

		return `${month} ${day} ${year} - ${hour}:${minute}`;
	}
</script>

<!-- <Faq /> -->
<TopBar page="Manage Your Loan" />
<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans.png')]"
	/>
	<div slot="header" class="flex flex-col items-center justify-center gap-2 pb-20">
		<h1 class="tracking-widest">Current Amount Borrowed</h1>
		<h2 class="text-4xl tracking-widest">{f(borrowed)}</h2>
	</div>

	<div slot="card">
		<div class="transform -translate-y-16 flex flex-col gap-4 p-4">
			<Card variant="popover" padding="base" class="flex flex-col gap-3 py-4 text-sm">
				<!-- header -->
				<div class="flex w-full justify-between tracking-widest">
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
								<p class={priceUp ? 'text-green-500' : 'text-red-500'}>
									{priceUp ? '↑+' : '↓-'}25.45%
								</p>
							</div>
						</div>
					</div>
					<div>
						<p class="font-bold text-right">{e(supplied)} ETH</p>
						<p class="text-sm">{f(suppliedValue)}</p>
					</div>
				</div>
				<section class="flex gap-2">
					<Button disabled={true} variant="outline" class="w-1/2 text-primary">Remove ETH</Button>
					<Button disabled={true} class="w-1/2">Add ETH</Button>
				</section>
			</Card>
			<!-- Borrowed -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-2 py-4">
				<div class="flex justify-between items-center">
					<div class="flex gap-3 items-center justify-start">
						<CreditCardIcon class="text-muted-foreground h-4 w-4" />
						<p class="tracking-widest font-bold pt-[1.5px]">Borrowed</p>
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
						<p class="font-bold">{borrowed.toFixed(2)} USDC</p>
						<p class="text-sm">{f(borrowed)}</p>
					</div>
				</div>
				<Separator />
				<div class="flex justify-between items-center">
					<p>Interest Rate</p>
					<p>{pc(interestRate)}</p>
				</div>
			</Card>
			<!-- Loan Health -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-2 py-4">
				<div class="flex justify-between items-center">
					<div class="flex gap-3 items-center justify-start">
						<GemIcon class="text-muted-foreground h-4 w-4" />
						<p class="tracking-widest font-bold pt-[1.5px]">Loan Health</p>
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
						<p>{getLiquidationStatus(loanLQPercentage)}</p>
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
					</p>
					<Button variant="link" class="text-left text-xs px-0">Learn More</Button>
				</div>
			</Card>
			<!-- Repay Loan -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-2 py-4">
				<div class="flex justify-between items-center">
					<div class="flex gap-3 items-center justify-start">
						<ReceiptIcon class="text-muted-foreground h-4 w-4" />
						<p class="tracking-widest font-bold pt-[1.5px]">Repay Loan</p>
					</div>
					<TooltipIcon text={TOOLTIPS.LOAN_REPAY} />
				</div>
				<div class="flex justify-between items-center gap-2">
					<div class="flex justify-between items-center w-full">
						<p>Outstanding Amount</p>
						<p class="text-secondary">{f(borrowed)} (+{f(500)} interest)</p>
					</div>
				</div>
				<div class="flex justify-between items-center w-full">
					<p>Repaid</p>
					<p>{f(2000.45)}</p>
				</div>
				<Separator />
				<div class="flex flex-col gap-1 pt-3">
					<div class="flex justify-between w-full gap-2">
						<FormatInput
							{formatter}
							bind:value={repayValue}
							class="grow w-full border-secondary border-[1px] rounded-xl px-4 font-bold"
						/>
						<div class="h-10 w-10 bg-background rounded-full flex items-center justify-center">
							<DollarSign class="text-secondary stroke-2 h-7 w-7" />
						</div>
					</div>
					<div class="flex justify-between items-center gap-2">
						<div class="flex justify-between items-center w-full text-xs text-muted-foreground">
							<p class="pl-1">Available Balance: {f(availableBalance)}</p>
							<Button variant="link" class="p-0 text-rightg text-xs" on:click={useMaxRepay}
								>Use Max</Button
							>
						</div>
					</div>
					<Button variant="outline" disabled={true} class="w-full text-primary"
						>Confirm Repayment</Button
					>
				</div></Card
			>
			<!-- Loan History -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-4 py-4 mb-20">
				<div class="flex justify-between items-center">
					<div class="flex gap-3 items-center justify-start">
						<HistoryIcon class="text-muted-foreground h-4 w-4" />
						<p class="tracking-widest font-bold pt-[1.5px]">Loan History</p>
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
			</Card>
		</div>
	</div>
</BaseScreen>
