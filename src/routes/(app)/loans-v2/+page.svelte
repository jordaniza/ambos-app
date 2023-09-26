<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { BACKGROUNDS } from '$lib/constants';
	import { f, getBarColor } from '$lib/utils';
	import {
		CreditCardIcon,
		DollarSign,
		GemIcon,
		HistoryIcon,
		InfoIcon,
		LockIcon,
		ReceiptIcon,
		RewindIcon
	} from 'lucide-svelte';
	import TopBar from '../dashboard-v2/top-bar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let priceUp = Math.random() > 0.5;
	let availableBalance = 1500.733434;
	let barWidth = 75;
	let repayValue = 0;

	$: barStyle = getBarColor(barWidth) + ' rounded-full h-full';

	function useMaxRepay(): void {
		repayValue = Number(availableBalance.toFixed(2));
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
</script>

<!-- <Faq /> -->
<TopBar page="Manage Your Loan" />
<BaseScreen>
	<div slot="background">
		<img src={BACKGROUNDS.LOANS_V2} alt="Ambos Loans" class="h-full w-full object-cover" />
	</div>
	<div slot="header" class="flex flex-col items-center justify-center gap-2 pb-20">
		<h1 class="tracking-widest">Current Amount Borrowed</h1>
		<h2 class="text-4xl tracking-widest">{f(100)}</h2>
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
					<InfoIcon class="text-muted-foreground h-4 w-4" />
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
						<p class="font-bold">2.34 ETH</p>
						<p class="text-sm">{f(3750.0)}</p>
					</div>
				</div>
				<section class="flex gap-2">
					<Button variant="outline" class="w-1/2 text-primary">Remove ETH</Button>
					<Button class="w-1/2">Add ETH</Button>
				</section>
			</Card>
			<!-- Borrowed -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-2 py-4">
				<div class="flex justify-between items-center">
					<div class="flex gap-3 items-center justify-start">
						<CreditCardIcon class="text-muted-foreground h-4 w-4" />
						<p class="tracking-widest font-bold pt-[1.5px]">Borrowed</p>
					</div>
					<InfoIcon class="text-muted-foreground h-4 w-4" />
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
						<p class="font-bold">4250 USDC</p>
						<p class="text-sm">{f(4249.99)}</p>
					</div>
				</div>
				<Separator />
				<div class="flex justify-between items-center">
					<p>Interest Rate</p>
					<p>0.23%</p>
				</div>
			</Card>
			<!-- Loan Health -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-2 py-4">
				<div class="flex justify-between items-center">
					<div class="flex gap-3 items-center justify-start">
						<GemIcon class="text-muted-foreground h-4 w-4" />
						<p class="tracking-widest font-bold pt-[1.5px]">Loan Health</p>
					</div>
					<InfoIcon class="text-muted-foreground h-4 w-4" />
				</div>
				<div class="flex items-center">
					<div class="flex-shrink mr-2 w-full items-center justify-center">
						<div class="bg-gray-200 rounded-full h-2 w-full relative">
							<div class={barStyle} style={`width: ${barWidth}%;`} />
						</div>
					</div>
					<p class="text-secondary">40%</p>
				</div>
				<div class="flex justify-between items-center gap-2">
					<div class="flex justify-between items-center w-full">
						<p>Risk of Liquidation</p>
						<p>Low</p>
					</div>
				</div>
				<div class="flex justify-between items-center w-full">
					<p>Liquidation Price</p>
					<p>{f(2000)} / ETH</p>
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
					<InfoIcon class="text-muted-foreground h-4 w-4" />
				</div>
				<div class="flex justify-between items-center gap-2">
					<div class="flex justify-between items-center w-full">
						<p>Outstanding Amount</p>
						<p class="text-secondary">{f(1000)} (+{f(500)} interest)</p>
					</div>
				</div>
				<div class="flex justify-between items-center w-full">
					<p>Repaid</p>
					<p>{f(2000.45)}</p>
				</div>
				<Separator />
				<div class="flex flex-col gap-1 pt-3">
					<div class="flex justify-between gap-2">
						<input
							class="grow border-secondary border-[1px] rounded-xl px-4 font-bold"
							type="number"
							bind:value={repayValue}
						/>
						<div class="h-10 w-10 bg-background rounded-full flex items-center justify-center">
							<DollarSign class="text-secondary stroke-2 h-7 w-7" />
						</div>
					</div>
					<div class="flex justify-between items-center gap-2">
						<div class="flex justify-between items-center w-full text-xs text-muted-foreground">
							<p>Available Balance: {f(availableBalance)}</p>
							<Button variant="link" class="p-0 text-rightg text-xs" on:click={useMaxRepay}
								>Use Max</Button
							>
						</div>
					</div>
					<Button variant="outline" class="w-full text-primary">Confirm Repayment</Button>
				</div></Card
			>
			<!-- Loan History -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-4 py-4">
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
