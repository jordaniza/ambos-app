<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { BACKGROUNDS } from '$lib/constants';
	import { f, getBarColor } from '$lib/utils';
	import {
		Bell,
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
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';

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

<BaseScreen>
	<div
		slot="background"
		class="w-full h-1/4 bg-cover bg-primary bg-top bg-[url('/backgrounds/notifications.png')]"
	/>
	<div slot="header" class="w-full tracking-widest pb-20">
		<nav
			class="w-full pt-4 px-4 pb-4 tracking-widest items-center justify-between text-popover flex gap-5"
		>
			<BackButton />
			<Bell class="h-5 w-5" />
		</nav>
		<p class="text-xl">Notifications</p>
	</div>

	<div slot="card">
		<div class="transform -translate-y-16 flex flex-col gap-4 p-4">
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
