<script lang="ts">
	import { getTxStore } from '$lib/context/getStores';
	import GetLoan from './handlers/get-loan.svelte';
	import RepayLoan from './handlers/repay-loan.svelte';
	let txStore = getTxStore();

	$: watchedTransactionIds = $txStore.watchedTransactionIds;
	$: watchedTransactions = watchedTransactionIds.map((id) => $txStore.transactions[id]);
</script>

{#each watchedTransactions as tx}
	{#if tx?.txType === 'INCREASE_DEBT'}
		<GetLoan {tx} />
	{:else if tx?.txType === 'DECREASE_DEBT'}
		<RepayLoan {tx} />
	{/if}
{/each}
