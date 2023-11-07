<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { HistoryIcon } from 'lucide-svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import Logout from '$lib/components/connect/logout.svelte';
	import { getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import { updateTransaction, type TXDetail } from '$stores/transactions/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import NotificationCircle from '$lib/components/ui/notification/notificationCircle.svelte';
	import { onDestroy } from 'svelte';

	const txStore = getTxStore();
	const web3Store = getWeb3Store();

	$: transactions = Object.entries($txStore.transactions).sort(sortFunctions.updatedOn) as [
		string,
		TXDetail
	][];
	$: chainId = $web3Store.chainId ?? 1;
	$: blockExplorer = BLOCK_EXPLORER_URLS[chainId];

	type Entry = [string, TXDetail];
	const sortFunctions: Record<string, (a: Entry, b: Entry) => number> = {
		updatedOn: (a, b) => new Date(b[1].updatedOn).getTime() - new Date(a[1].updatedOn).getTime(),

		state: (a, b) => {
			if (a[1].state === b[1].state) {
				return sortFunctions.updatedOn(a, b);
			}
			return a[1].state.localeCompare(b[1].state);
		},

		type: (a, b) => {
			if (a[1].txType === b[1].txType) {
				return sortFunctions.updatedOn(a, b);
			}
			return a[1].txType.localeCompare(b[1].txType);
		}
	};

	// capitalise first letter of every word and lower case the rest
	// also remove any underscores with spaces
	function toProperCase(str: string): string {
		const proper = str.replace(
			/\w\S*/g,
			(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
		);
		return proper.replace(/_/g, ' ');
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

	onDestroy(() => {
		// mark all notifications as seen
		for (const [id, item] of transactions) {
			if (!item.seen) {
				updateTransaction(txStore, id, { seen: true });
			}
		}
	});
</script>

<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/notifications.png')]"
	/>
	<div slot="header" class="w-full pb-20">
		<nav class="w-full pt-4 pb-4 items-center justify-between text-popover flex gap-5">
			<BackButton />
		</nav>
		<p class="text-xl font-bold -mt-4">Notifications</p>
	</div>

	<div slot="card">
		<div class="transform -translate-y-16 flex flex-col gap-4 p-4">
			<!-- Loan History -->
			<Card variant="popover" padding="base" class="flex text-sm flex-col gap-4 py-4">
				<div class="flex justify-between items-center">
					<div class="flex gap-3 items-center justify-start">
						<HistoryIcon class="text-muted-foreground h-4 w-4" />
						<p class=" font-bold pt-[1.5px]">Loan History</p>
					</div>
				</div>
				<div class="flex flex-col gap-4 py-4 overflow-y-scroll max-h-[600px]">
					{#each transactions as [id, item]}
						<Card
							padding="base"
							class="relative flex flex-col shadow-none justify-between items-center gap-2"
						>
							<NotificationCircle txId={id} position="absolute top-0 left-0" />
							<div class="flex justify-between items-center w-full text-muted-foreground">
								<p>{toProperCase(item.txType)}</p>
								<p>{formatTimestamp(item.updatedOn)}</p>
							</div>
							<div class="flex justify-between items-center w-full">
								<p>{item.state}</p>

								{#if item.finalTxHash}
									<Button variant="link">
										<a
											class="w-full h-full"
											href={`${blockExplorer}/tx/${item.finalTxHash}`}
											target="_blank">Details</a
										>
									</Button>
								{/if}
							</div>
						</Card>
					{/each}
				</div>
			</Card>
		</div>
		<div class="h-20" />
	</div>
</BaseScreen>
