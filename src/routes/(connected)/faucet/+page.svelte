<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { BN, cn, f } from '$lib/utils';
	import { requestWETHFromTestnetFaucet } from '$stores/transactions/actions';
	import { FlaskConical } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import {
		TX_STATES_SUMMARY,
		getLatestTransactionOfType,
		type TXState
	} from '$stores/transactions/state';
	import { toast } from 'svelte-sonner';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';

	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();
	let txStore = getTxStore();
	let isPending = false;

	const requestQty = 10;

	$: isTestnet = $web3Store.isTestnet;
	$: provider = $accountStore.provider;
	$: address = $accountStore.address;
	$: smartAccount = $accountStore.smartAccount;
	$: wethBalance = $web3Store.balances.WETH.small ?? 0;
	$: title = isTestnet ? 'Testnet Detected' : 'No Testnet Detected';
	$: transaction = getLatestTransactionOfType($txStore, 'REQUEST_WETH_FROM_FAUCET');
	$: state = transaction?.state;
	$: seen = transaction?.seen;

	$: if (state !== undefined) {
		// update the notification
		const [message, showToast] = updateMessage(state, seen);
		if (message && showToast) {
			toast(message);
		}

		// the state should be loading while pending
		if (TX_STATES_SUMMARY['PENDING'].includes(state)) {
			isPending = true;
		} else {
			isPending = false;
		}
	}

	function updateMessage(state: TXState, seen: boolean | undefined): [string, boolean] {
		if (seen) return ['', false];
		switch (state) {
			case 'STARTED':
				return ['Requesting ETH from the Faucet.', false];
			case 'SIGNING':
				return ['Awaiting Signature', true];
			case 'SIGNED':
				return ['Requested, please wait for funds to arrive', true];
			case 'FAILED':
			case 'REJECTED':
				return ['There was a problem requesting you ETH.', true];
			case 'SUCCESSFUL':
				return [`Success! Your balance is now ${wethBalance + requestQty} ETH`, true];
			default:
				return ['', false];
		}
	}

	async function onClick() {
		if (!isTestnet) {
			throw new Error('Not testnet');
		}
		if (!provider || !address || !smartAccount) {
			throw new Error('No provider or address');
		}

		try {
			await requestWETHFromTestnetFaucet(txStore, BN(requestQty), provider, address, smartAccount);
		} catch (e) {
			console.error('ERROR WITH REQUESTING FUNDS', e);
		}
	}
</script>

<div class="p-4">
	<Card class={cn('w-full')}>
		<CardHeader>
			<CardTitle class="flex items-center">
				<FlaskConical class="h-8 w-8 mr-2" />
				{title}
			</CardTitle>
		</CardHeader>
		<Separator class="mb-5" />
		<CardContent class="">
			<section class="flex flex-col justify-between">
				<p>
					Testnet ETH has no value but you can request some to try out the application. You can
					request 10 free testnet ETH using the button below.
				</p>
				{#if !isTestnet}
					<br />
					<p class="text-sm text-destructive italic">
						You are not connected to a testnet. Please connect to a testnet to request testnet ETH.
					</p>
				{/if}
				<div class="flex flex-col mt-5">
					<p class="text-md leading-none mb-2 font-bold">Balance</p>
					<div class="flex items-center space-x-4">
						<p class="text-xl font-bold">{wethBalance} ETH</p>
					</div>
				</div>
			</section>
		</CardContent>
		<Separator class=" mb-5" />
		<CardFooter>
			<Button on:click={onClick} disabled={!isTestnet}>
				{#if isPending}
					<LoadingSpinner />
				{:else}
					Get Testnet ETH
				{/if}
			</Button>
		</CardFooter>
	</Card>
</div>
