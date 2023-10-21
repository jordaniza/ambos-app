<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { e, f, getBarColor, getLiquidationPrice, pc } from '$lib/utils';
	import {
		CreditCardIcon,
		DollarSign,
		ExternalLink,
		GemIcon,
		LockIcon,
		ReceiptIcon
	} from 'lucide-svelte';
	import TopBar from '../dashboard/top-bar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import Logout from '$lib/components/connect/logout.svelte';

	type HistoryItem = {
		action: string;
		currency: string;
		usdValue: number;
		timestamp: number;
	};

	const now = new Date().getTime();

	let priceUp = Math.random() > 0.5;
	let openRepay = false;
	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();

	$: address = $accountStore.address;
	$: chainId = $web3Store.chainId ?? 1;
	$: explorerURL = BLOCK_EXPLORER_URLS[chainId] + '/address/' + address;
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
	$: borrowText = borrowed > 0 ? 'Borrow More' : 'Start Borrowing';
	$: liquidationRiskTextColor = getLiquidationColor(barWidth);

	function getLoanLiquidationPercentage(borrowed: number, supplied: number, maxLTV: number) {
		// first get the borrowed out of supplied
		const borrowedOutOfSupplied = borrowed / supplied;
		// now we need that as a percentage of the maxLTV
		return borrowedOutOfSupplied / maxLTV;
	}

	function getLiquidationColor(barWidth: number): string {
		switch (true) {
			case barWidth > 75:
				return 'text-destructive';
			case barWidth > 60:
				return 'text-orange-500';
			case barWidth > 50:
				return 'text-yellow-600';
			case barWidth > 25:
				return 'text-green-300';
			default:
				return 'text-primary';
		}
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
<TopBar page="Profile" />
<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans.png')]"
	/>
	<div slot="header" class="flex flex-col items-center justify-center gap-2 pb-20">
		<h1 class="tracking-widest">vinz@ambos.finance</h1>
		<button class="rounded-2xl bg-card-foreground opacity-80 text-sm px-3 py-1">
			<a href={explorerURL} class="w-full flex items-center gap-1" target="_blank">
				<p>View on Explorer</p>
				<ExternalLink class="h-3 w-3" />
			</a>
		</button>
	</div>

	<div slot="card" class="p-4 gap-5 flex flex-col">
		<Card variant="popover" class="flex flex-col gap-5 items-center p-4">
			<p class="text-start w-full font-bold">Settings</p>
			<Logout class="w-full bg-transparent border-secondary text-secondary border-[1px]" />
		</Card>
		<Card variant="popover" class="flex flex-col gap-5 items-center p-4">
			<p class="font-bold w-full text-start">Got Feedback? We'd love to hear it</p>
			<textarea
				class="w-full text-sm text-s rounded-2xl border-[1px] border-muted p-2 min-h-[150px] outline-none"
				placeholder="Write your feedback here..."
			/>
		</Card>
	</div>
</BaseScreen>
