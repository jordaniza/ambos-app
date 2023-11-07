<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import MultiSwitch from '$lib/components/ui/multi-switch/multi-switch.svelte';
	import Buy from '../buy/buy.svelte';
	import Exchange from './exchange.svelte';
	import Manual from './manual.svelte';
	import Success from './success.svelte';
	import Verification from './verification.svelte';
	import Wallet from './wallet.svelte';
	import { getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { increaseTxCounter } from '$stores/transactions/state';
	import { onDestroy } from 'svelte';

	export let transferred: number;
	export let toBeTransferred: number;

	let manualWalletExchange = ['Manual', 'Wallet', 'Exchange'];
	let manualWalletExchangeIndex = 0;
	let transferBuy = ['Transfer ETH', 'Buy ETH'];
	let transferBuyIndex = 0;
	let txStore = getTxStore();
	let web3Store = getWeb3Store();
	let interval: NodeJS.Timeout;

	let showVerifying = false;
	let showSuccess = false;
	let isVerifying = false;

	$: ethBalance = $web3Store.balances.WETH.small ?? 0;
	$: useTransfer = transferBuy[transferBuyIndex] === 'Transfer ETH';
	$: useBuy = transferBuy[transferBuyIndex] === 'Buy ETH';
	$: hasEth = $txStore.builders.INCREASE_DEBT.hasEth;

	$: useManual = manualWalletExchange[manualWalletExchangeIndex] === 'Manual';
	$: useWallet = manualWalletExchange[manualWalletExchangeIndex] === 'Wallet';
	$: useExchange = manualWalletExchange[manualWalletExchangeIndex] === 'Exchange';

	// default to buy if the user doesn't have eth
	$: {
		if (!hasEth) {
			transferBuy = ['Buy ETH', 'Transfer ETH'];
			useBuy = true;
		}
	}

	$: {
		// reset the manualWalletExchangeIndex when we switch between transfer and buy
		// to avoid showing the wrong option when the user changes back
		if (useBuy) manualWalletExchangeIndex = 0;
	}

	$: {
		if (isVerifying) {
			watchForNewEth();
		} else {
			clearInterval(interval);
		}
	}

	/**
	 * 5 second polling to check if the user has received any new ETH
	 * If they have, we stop the polling and trigger the verification component
	 */
	function watchForNewEth() {
		const initialETH = ethBalance;
		interval = setInterval(() => {
			increaseTxCounter(txStore);
			if (ethBalance > initialETH) {
				isVerifying = false;
				showVerifying = false;
				showSuccess = true;
				transferred = ethBalance - initialETH;
				clearInterval(interval);
			}
		}, 5000);
	}

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<MultiSwitch disabled={showVerifying} items={transferBuy} bind:selectedIndex={transferBuyIndex} />
<!-- Transfer Select Modal -->
{#if showSuccess}
	<Success {transferred} />
{:else if showVerifying}
	<Verification bind:showVerifying />
{:else}
	<!-- TRANSFER ETH -->
	{#if useTransfer}
		<Card class="bg-popover p-4 flex flex-col gap-5">
			<div class="flex flex-col gap-5">
				<p>Pick Your Transfer Option</p>
				<MultiSwitch items={manualWalletExchange} bind:selectedIndex={manualWalletExchangeIndex} />
				<!-- Network Warning -->
			</div>
			{#if useManual}
				<Manual bind:showVerification={showVerifying} bind:startVerification={isVerifying} />
			{:else if useExchange}
				<Exchange />
			{:else if useWallet}
				<Wallet />
			{/if}
		</Card>

		<!-- BUY ETH -->
	{:else if useBuy}
		<Buy quantity={toBeTransferred} />
	{/if}
{/if}
