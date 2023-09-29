<script lang="ts">
	import { getTxStore } from '$lib/context/getStores';
	import { TX_STATES_SUMMARY } from '$stores/transactions/state';
	import { fade } from 'svelte/transition';

	const txStore = getTxStore();

	export let position = 'top-0 right-0';
	export let txId: string | undefined = undefined;

	$: transactions = txId ? [$txStore.transactions[txId]] : Object.values($txStore.transactions);
	$: unseen = transactions.filter((tx) => !tx.seen);
	$: pending = unseen.filter((tx) => TX_STATES_SUMMARY['PENDING'].includes(tx.state));
	$: failed = unseen.filter((tx) => TX_STATES_SUMMARY['REJECTED'].includes(tx.state));
	$: successful = unseen.filter((tx) => TX_STATES_SUMMARY['FULFILLED'].includes(tx.state));

	$: color =
		pending.length > 0
			? 'bg-yellow-500'
			: failed.length > 0
			? 'bg-red-500'
			: successful.length > 0
			? 'bg-green-500'
			: '';
</script>

<div class={'absolute h-3 w-3 rounded-full ' + position + ' ' + color} in:fade />
