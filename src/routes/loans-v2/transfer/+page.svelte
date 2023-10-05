<script lang="ts">
	import Eth from '$lib/eth.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import LoanStepper from '$lib/components/ui/stepper/loanStepper.svelte';
	import { InfoIcon } from 'lucide-svelte';
	import { BACKGROUNDS, ROUTES } from '$lib/constants';
	import Transfer from './transfer/transfer.svelte';
	import { onMount } from 'svelte';
	import { getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { e } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import NetworkLogo from '$lib/components/ui/network/network-logos.svelte';
	import NetworkName from '$lib/components/ui/network/network-names.svelte';
	import { setIncreaseDebtBuilderStage as setIncreaseDebtBuilderStage } from '$stores/transactions/builders';
	import { goto } from '$app/navigation';

	// display ticker to show new ETH transferred
	let increaseTicker = 0;

	// bound to the transfer component to trigger the animation
	let transferred: number;

	// flag to show the ticker
	let showNewETH = false;

	let web3Store = getWeb3Store();
	let txStore = getTxStore();

	$: ethBuilderSupply = $txStore.builders.INCREASE_DEBT.ethToSupply ?? 0;
	$: ethBalance = $web3Store.balances.WETH.small ?? 0;

	$: toBeTransferred = Math.max(0, ethBuilderSupply - ethBalance);

	$: hasEnough = ethBalance >= ethBuilderSupply;

	$: {
		if (transferred > 0) {
			triggerEffect();
		}
	}

	onMount(() => {
		setIncreaseDebtBuilderStage(txStore, 'transfer');
	});

	async function copyBalanceToClipboard() {
		toast.success('Copied to clipboard');
		await navigator.clipboard.writeText(ethBalance.toString());
	}

	function triggerEffect() {
		showNewETH = true;
		const duration = 2000;
		const step = 10;

		const totalSteps = duration / step;
		const increasePerStep = transferred / totalSteps;

		increaseTicker = 0; // Reset the counter before starting the animation

		const interval = setInterval(() => {
			increaseTicker += increasePerStep;

			// When we've reached or exceeded our target, clear the interval
			if (increaseTicker >= transferred) {
				increaseTicker = transferred; // Ensure we don't overshoot the target
				clearInterval(interval);
			}
		}, step);
	}
</script>

<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans.png')]"
	/>
	<div slot="header" class="pb-5">
		<BackButton backTo={ROUTES.DASHBOARD_V2} />
		<div class="pt-5 px-4">
			<h1 class="font-extrabold text-2xl pb-3 tracking-widest">Transfer Your ETH Securely</h1>
			<p>Transfer your ETH securely to proceed with your loan application</p>
		</div>
	</div>
	<div slot="card" class="p-4 flex flex-col gap-5 pb-20">
		<LoanStepper />

		<Card>
			<Card class="bg-popover p-4 flex flex-col gap-4">
				<!-- ETH Summary -->

				<Card
					class="p-6 text-popover bg-[url('/backgrounds/card.png')] rounded-3xl flex flex-col gap"
				>
					<div class="w-full flex justify-between">
						<div class=" rounded-xl">
							<p class="font-extrabold text-lg">ETH</p>
							<p class="text-sm font-extralight text-muted-foreground">Your Ambos Wallet</p>
						</div>
						<div class="flex flex-col items-end justify-between">
							<div class="h-10 w-10 bg-popover p-2 rounded-full">
								<Eth />
							</div>
							<p
								class={'font-xl text-primary transition-opacity duration-300 ' +
									(showNewETH ? ' opacity-100' : ' opacity-0')}
							>
								+ {increaseTicker.toFixed(2)} ETH
							</p>
						</div>
					</div>
					<div class="w-full flex justify-between items-center">
						<p class="text-2xl">{e(ethBalance)} ETH</p>
						{#if hasEnough}
							<Button on:click={() => goto(ROUTES.LOANS_V2_REVIEW)}>Use Wallet</Button>
						{/if}
					</div>
				</Card>
				<!-- Transfer Widget -->
				<div class="flex flex-col gap-3">
					<div class="w-full flex justify-between font-bold tracking-wide">
						<p>Amount to deposit</p>
						<p class="text-secondary">Edit</p>
					</div>
					<div class="border border-secondary p-1 rounded-xl flex">
						<p class="w-full px-4 py-2 font-bold flex items-center justify-between mr-2 text-sm">
							{e(toBeTransferred)} ETH
						</p>
						<Button variant="secondary" class="px-5" on:click={copyBalanceToClipboard}>Copy</Button>
					</div>
					<Card class="flex justify-between px-3 py-2 text-sm shadow-none">
						<div class="flex items-center">
							<div class="h-8 w-8 bg-popover flex items-center justify-center rounded-full">
								<NetworkLogo class="h-5 w-5" />
							</div>
							<NetworkName class="pl-2 font-bold" />
						</div>
						<div class="flex items-center justify-end gap-2">
							<p>ETH</p>
							<InfoIcon class="h-4 w-4 text-muted-foreground" />
						</div></Card
					>
				</div>
			</Card>
		</Card>
		<Transfer bind:transferred />
	</div>
</BaseScreen>
