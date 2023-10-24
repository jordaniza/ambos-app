<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

	import Card from '$lib/components/ui/card/card.svelte';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ROUTES } from '$lib/constants';
	import { getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { increaseTxCounter } from '$stores/transactions/state';
	import { onDestroy, onMount } from 'svelte';

	// is the component visible, can be set to false to hide the component
	export let showVerifying: boolean;
	// are we awaiting verification
	export let isVerifying: boolean = true;
	// number of ETH detected as transferred
	export let transferred: number;

	const setEscape = () => (showVerifying = false);
	let web3Store = getWeb3Store();
	let txStore = getTxStore();
	let interval: NodeJS.Timeout;

	$: ethBalance = $web3Store.balances.WETH.small ?? 0;

	onMount(() => {
		watchForNewEth();
	});

	onDestroy(() => {
		clearInterval(interval);
	});

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
				transferred = ethBalance - initialETH;
				clearInterval(interval);
			}
		}, 5000);
	}
</script>

<Card class="bg-popover px-4 py-2 text-center">
	<div class="flex flex-col gap-3 w-full items-center">
		<div class="flex w-full justify-start -mb-2">
			<Button
				on:click={setEscape}
				variant="link"
				class="text-popover-foreground no-underline text-left tracking-wider text-lg "
				>← Back</Button
			>
		</div>
		<Separator />
		<p class="font-bold text-lg">Waiting for ETH</p>
		<div class="h-20 w-20 flex justify-center items-center relative">
			<div class="absolute h-14 w-14 rounded-full bg-popover z-10" />
			<div class="absolute h-16 w-16 rounded-full bg-secondary opacity-10" />
			<LoadingSpinner
				class="absolute h-20 w-20 animate-spin text-secondary z-20 font-thin stroke-1"
			/>
		</div>
		<div class="flex flex-col w-full items-center gap-3">
			<p>You're almost done!<br />We're waiting for your ETH to arrive in your Ambos Wallet.</p>
			<Separator />
			<p class="text-muted-foreground">
				We will send you a notification once your ETH has arrived.
			</p>
			<Button variant="outline" class="mb-2 mt-1 w-full" on:click={() => goto(ROUTES.DASHBOARD_V2)}
				>Back to the App</Button
			>
		</div>
	</div>
</Card>
