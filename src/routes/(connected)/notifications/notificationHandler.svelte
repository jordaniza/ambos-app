<script lang="ts">
	import { getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { CHAIN_ETH_TYPE } from '$lib/contracts';
	import ApproveErc20 from './handlers/approveERC20.svelte';
	import GetLoan from './handlers/get-loan.svelte';
	import RemoveCollateral from './handlers/remove-collateral.svelte';
	import RepayLoan from './handlers/repay-loan.svelte';
	import SwapErc20 from './handlers/swapERC20.svelte';
	import Transfer from './handlers/transfer.svelte';
	import TransferEthIntoEoa from './handlers/transferETHIntoEOA.svelte';

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
	{:else if tx.txType === 'APPROVE_TOKEN'}
		<ApproveErc20 {tx} />
	{:else if tx.txType === 'SWAP_TOKEN'}
		<SwapErc20 {tx} />
	{:else if tx.txType === 'DEPOSIT_ETH_INTO_SMART_ACCOUNT'}
		<TransferEthIntoEoa {tx} />
	{/if}
{/each}
