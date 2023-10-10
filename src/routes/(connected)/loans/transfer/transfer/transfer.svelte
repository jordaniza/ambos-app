<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import MultiSwitch from '$lib/components/ui/multi-switch/multi-switch.svelte';
	import Buy from '../buy/buy.svelte';
	import Exchange from './exchange.svelte';
	import Manual from './manual.svelte';
	import Success from './success.svelte';
	import Verification from './verification.svelte';
	import Wallet from './wallet.svelte';

	export let transferred: number;

	let manualWalletExchange = ['Manual', 'Wallet', 'Exchange'];
	let manualWalletExchangeIndex = 0;
	let transferBuy = ['Transfer Ethereum', 'Buy Ethereum'];
	let transferBuyIndex = 0;

	/**
	 * We start isVerifying as true so that the verification component shows up
	 * At which point it can set isVerifying to false once it receives the response
	 */
	let showVerifying = false;
	let isVerifying = true;

	$: useTransfer = transferBuy[transferBuyIndex] === 'Transfer Ethereum';
	$: useBuy = transferBuy[transferBuyIndex] === 'Buy Ethereum';

	$: {
		// reset the manualWalletExchangeIndex when we switch between transfer and buy
		// to avoid showing the wrong option when the user changes back
		if (useBuy) manualWalletExchangeIndex = 0;
	}

	$: useManual = manualWalletExchange[manualWalletExchangeIndex] === 'Manual';
	$: useWallet = manualWalletExchange[manualWalletExchangeIndex] === 'Wallet';
	$: useExchange = manualWalletExchange[manualWalletExchangeIndex] === 'Exchange';
</script>

<MultiSwitch disabled={showVerifying} items={transferBuy} bind:selectedIndex={transferBuyIndex} />
<!-- Transfer Select Modal -->
{#if showVerifying}
	<!-- verifying in progress and should show it -->
	{#if isVerifying}
		<Verification bind:showVerifying bind:isVerifying bind:transferred />
		<!-- Else it's done -->
	{:else}
		<Success {transferred} />
	{/if}

	<!-- if not showVerifying, give options -->
{:else if !showVerifying}
	<!-- TRANSFER ETH -->
	{#if useTransfer}
		<Card class="bg-popover p-4 flex flex-col gap-5">
			<div class="flex flex-col gap-5">
				<p>Pick Your Transfer Option</p>
				<MultiSwitch items={manualWalletExchange} bind:selectedIndex={manualWalletExchangeIndex} />
				<!-- Network Warning -->
			</div>
			{#if useManual}
				<Manual bind:verifying={showVerifying} />
			{:else if useExchange}
				<Exchange />
			{:else if useWallet}
				<Wallet />
			{/if}
		</Card>

		<!-- BUY ETH -->
	{:else if useBuy}
		<Buy />
	{/if}
{/if}