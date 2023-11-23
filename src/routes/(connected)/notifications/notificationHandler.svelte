<script lang="ts">
	import { getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { CHAIN_ETH_TYPE } from '$lib/contracts';
	import GetLoan from './handlers/get-loan.svelte';
	import RemoveCollateral from './handlers/remove-collateral.svelte';
	import RepayLoan from './handlers/repay-loan.svelte';
	import Transfer from './handlers/transfer.svelte';

	let txStore = getTxStore();
	let web3Store = getWeb3Store();

	$: chainId = $web3Store.chainId ?? 1;
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';
	$: watchedTransactionIds = $txStore.watchedTransactionIds;
	$: watchedTransactions = watchedTransactionIds.map((id) => $txStore.transactions[id]);
</script>

{#each watchedTransactions as tx}
	{#if tx?.txType === 'INCREASE_DEBT'}
		<GetLoan {tx} />
	{:else if tx?.txType === 'DECREASE_DEBT'}
		<RepayLoan {tx} />
	{:else if tx?.txType === 'SEND_ETH' || tx?.txType === 'SEND_WETH'}
		<Transfer {tx} currency={ethType} />
	{:else if tx.txType === 'SEND_USDC'}
		<Transfer {tx} currency="USDC" />
	{:else if tx.txType === 'REMOVE_COLLATERAL'}
		<RemoveCollateral {tx} />
	{/if}
{/each}
