<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import MultiSwitch from '$lib/components/ui/multi-switch/multi-switch.svelte';
	import Buy from '../buy/buy.svelte';
	import Manual from './manual.svelte';
	import Success from './success.svelte';
	import Verification from './verification.svelte';
	import Wallet from './wallet.svelte';
	import { getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { increaseTxCounter } from '$stores/transactions/state';
	import { onDestroy } from 'svelte';
	import { CHAIN_ETH_TYPE } from '$lib/contracts';
	import { accountStore } from '$stores/account';

	export let transferred: number;
	export let toBeTransferred: number;

	const manualWallet = ['Wallet', 'Manual'];
	let manualWalletIndex = 0;
	let transferBuy = ['Transfer ETH', 'Buy ETH'];
	let transferBuyIndex = 0;
	let txStore = getTxStore();
	let web3Store = getWeb3Store();
	let interval: NodeJS.Timeout;

	let showVerifying = false;
	let showSuccess = false;
	let isVerifying = false;

	$: chainId = $web3Store.chainId ?? 1;
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';
	$: ethBalance = $web3Store?.balances[ethType].small ?? 0;
	$: useTransfer = transferBuy[transferBuyIndex] === 'Transfer ETH';
	$: useBuy = transferBuy[transferBuyIndex] === 'Buy ETH';
	$: hasEth = $txStore.builders.INCREASE_DEBT.hasEth;
	$: isUsingWallet = $accountStore.signInMethod === 'wallet';
	// wallet transfer only works if the user is using a wallet
	$: headings = isUsingWallet ? manualWallet : ['Manual'];

	$: useManual = headings[manualWalletIndex] === 'Manual';
	$: useWallet = headings[manualWalletIndex] === 'Wallet';

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
		if (useBuy) manualWalletIndex = 0;
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
			{#if isUsingWallet}
				<div class="flex flex-col gap-5">
					<p>Pick Your Transfer Option</p>
					<MultiSwitch items={headings} bind:selectedIndex={manualWalletIndex} />
					<!-- Network Warning -->
				</div>
			{/if}
			{#if useManual}
				<Manual bind:showVerification={showVerifying} bind:startVerification={isVerifying} />
				<!-- {:else if useExchange} -->
				<!-- <Exchange /> -->
			{:else if useWallet}
				<Wallet bind:showVerification={showVerifying} bind:startVerification={isVerifying} />
			{/if}
		</Card>

		<!-- BUY ETH -->
	{:else if useBuy}
		<Buy quantity={toBeTransferred} />
	{/if}
{/if}
