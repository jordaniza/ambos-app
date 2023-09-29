<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import NotificationCircle from '$lib/components/ui/notification/notificationCircle.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Table from '$lib/components/ui/table';
	import { getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import { updateTransaction, type TXDetail, type TXState } from '$stores/transactions/state';

	const txStore = getTxStore();
	const web3Store = getWeb3Store();
	let selectedTx: TXDetail | undefined;

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

	$: sortBy = 'updatedOn';
	$: transactions = Object.entries($txStore.transactions).sort(
		sortFunctions[sortBy] || sortFunctions.updatedOn
	);
	$: chainId = $web3Store.chainId ?? 1;
	$: blockExplorer = BLOCK_EXPLORER_URLS[chainId];

	function proper(text: string) {
		return text
			.split('_')
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(' ');
	}

	function fDate(date: Date | number) {
		if (typeof date === 'number') {
			date = new Date(date);
		}
		const dd = String(date.getDate()).padStart(2, '0');
		const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
		const yy = String(date.getFullYear()).substr(2, 2);
		const hh = String(date.getHours()).padStart(2, '0');
		const min = String(date.getMinutes()).padStart(2, '0');
		const ss = String(date.getSeconds()).padStart(2, '0');

		return `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;
	}

	function getColor(state: TXState) {
		switch (state) {
			case 'SIGNED':
			case 'SIGNING':
			case 'STARTED':
				return 'text-yellow-500';
			case 'FAILED':
			case 'REJECTED':
				return 'text-destructive';
			case 'SUCCESSFUL':
				return 'text-green-500';
			default:
				return 'bg-primary';
		}
	}

	async function copyToClipboard(str: string) {
		await navigator.clipboard.writeText(str);
	}

	function showDetails(id: string) {
		selectedTx = $txStore.transactions[id];
		if (!selectedTx || selectedTx.seen) return;
		updateTransaction(txStore, id, { seen: true });
	}
</script>

<section class="p-4">
	<h1 class="text-center mb-5 font-bold">Your Transaction History</h1>
	<div class="my-5">
		{#if selectedTx}
			<Card>
				<CardHeader>
					<CardTitle>
						<h1 class="md:text-2xl">Transaction Details</h1>
					</CardTitle>
					{#if selectedTx.sponsored}
						<Badge variant="outline" class="w-20">Sponsored</Badge>
					{/if}
				</CardHeader>
				<CardContent>
					<div class="flex justify-between mb-2">
						<b>Created On:</b> <span>{fDate(selectedTx.createdOn)}</span>
					</div>
					<div class="flex justify-between mb-2">
						<b>Updated On:</b> <span>{fDate(selectedTx.updatedOn)}</span>
					</div>
					<div class="flex justify-between mb-2">
						<b>Name:</b> <span>{proper(selectedTx.txType.replace(/_/g, ' '))}</span>
					</div>
					<div class="flex justify-between mb-2">
						<b>Status:</b>
						<span class={getColor(selectedTx.state)}>{proper(selectedTx.state)}</span>
					</div>
					{#if selectedTx.error}
						<div class="flex justify-between mb-2">
							<b>Errors:</b>
							<span class={getColor(selectedTx.state)}>{selectedTx.error}</span>
						</div>
					{/if}
				</CardContent>
				{#if selectedTx.finalTxHash}
					<Separator class="mb-5" />
					<CardFooter class="flex flex-row items-center justify-start space-x-4">
						<Button>
							<a href={`${blockExplorer}/tx/${selectedTx.finalTxHash}`} target="_blank"
								>View on Explorer</a
							>
						</Button>
						{#if selectedTx.userOpReceiptHash || selectedTx.txReceiptHash}
							<Button
								variant="secondary"
								on:click={() =>
									copyToClipboard(selectedTx?.userOpReceiptHash || selectedTx?.txReceiptHash || '')}
							>
								Copy Receipt Hash
							</Button>
						{/if}
					</CardFooter>
				{/if}
			</Card>
		{/if}
	</div>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head
					class={'text-center cursor-pointer' +
						(sortBy === 'updatedOn' ? ' font-extrabold text-white' : '')}
					><div class="w-full z-999" on:click={() => (sortBy = 'updatedOn')}>
						Updated
					</div></Table.Head
				>
				<Table.Head
					class={'text-center cursor-pointer' +
						(sortBy === 'type' ? ' font-extrabold text-white' : '')}
					><div class="w-full z-999" on:click={() => (sortBy = 'type')}>
						Transaction
					</div></Table.Head
				>
				<Table.Head
					class={'text-center cursor-pointer' +
						(sortBy === 'state' ? ' font-extrabold text-white' : '')}
					><div class="w-full z-999" on:click={() => (sortBy = 'state')}>Status</div></Table.Head
				>
			</Table.Row>
		</Table.Header>
		<Table.Body class="text-center">
			{#if transactions}
				{#each transactions as [id, tx]}
					<Table.Row>
						<Table.Cell class="relative">
							{fDate(new Date(tx.updatedOn))}
							<NotificationCircle txId={id} position="top-2 right-3" />
						</Table.Cell>
						<Table.Cell>{proper(tx.txType)}</Table.Cell>
						<Table.Cell>
							<Button variant="link" class={getColor(tx.state)} on:click={() => showDetails(id)}
								>{proper(tx.state)}</Button
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={3}>No transactions found</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</section>
