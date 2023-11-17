<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import LoanStepper from '$lib/components/ui/stepper/loanStepper.svelte';
	import { ROUTES } from '$lib/constants';
	import Transfer from './transfer/transfer.svelte';
	import { onMount } from 'svelte';
	import { getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { e } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import { setIncreaseDebtBuilderStage as setIncreaseDebtBuilderStage } from '$stores/transactions/builders';
	import { goto } from '$app/navigation';
	import Counter from '$lib/components/ui/counter/counter.svelte';
	import NetworkNameLogo from '$lib/components/ui/network/network-name-logo.svelte';
	import EthWalletCard from '$lib/components/wallet-cards/eth-wallet-card.svelte';
	import { CHAIN_ETH_TYPE } from '$lib/contracts';

	// bound to the transfer component to trigger the animation
	let transferred: number;
	// flag to show the ticker
	let showNewETH = false;
	let recommendedGas = 0.01;

	let web3Store = getWeb3Store();
	let txStore = getTxStore();

	$: chainId = $web3Store.chainId ?? 1;
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';
	$: ethBalance = $web3Store?.balances[ethType].small ?? 0;
	$: ethBuilderSupply = $txStore.builders.INCREASE_DEBT.ethToSupply ?? 0;
	$: toBeTransferred = Math.max(0, ethBuilderSupply - ethBalance + recommendedGas);
	$: hasEnough = ethBalance >= ethBuilderSupply;
	$: hasEnoughPlusFees = ethBalance >= ethBuilderSupply + recommendedGas;

	$: {
		if (transferred > 0) {
			showNewETH = true;
		}
	}

	function formatter(n: number) {
		return e(n) + ' ETH';
	}

	onMount(() => {
		setIncreaseDebtBuilderStage(txStore, 'transfer');
	});

	async function copyBalanceToClipboard() {
		toast.success('Copied to clipboard');
		await navigator.clipboard.writeText(toBeTransferred.toString());
	}
</script>

<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans-2.png')]"
	/>
	<div slot="header" class="pb-5">
		<BackButton backTo={ROUTES.LOANS_V2_CALCULATE} />
		<div class="pt-5 px-4">
			<h1 class="font-extrabold text-2xl pb-3">Transfer Your ETH Securely</h1>
			<p>Transfer your ETH securely to proceed with your loan application</p>
		</div>
	</div>
	<div slot="card" class="p-4 flex flex-col gap-5 pb-20">
		<LoanStepper />

		<Card>
			<Card class="bg-popover p-4 flex flex-col gap-4">
				<!-- ETH Summary -->

				<EthWalletCard>
					<div slot="trigger-right" class="flex items-center justify-center">
						{#if showNewETH}
							<Counter class="text-secondary pt-2 text-xl" target={transferred} {formatter} />
						{/if}
					</div>
				</EthWalletCard>

				<!-- Transfer Widget -->
				<div class="flex flex-col gap-3">
					<div class="flex flex-col max-w-2/3 gap-3 text-center px-10 pb-3 pt-1 items-center">
						{#if hasEnoughPlusFees}
							<p class="text-primary text-sm">You have enough ETH to proceed with your loan.</p>
							<Button class="w-40" on:click={() => goto(ROUTES.LOANS_V2_REVIEW)}
								>Review Loan Details</Button
							>
						{:else if hasEnough}
							<p class="text-destructive text-sm">
								You have enough ETH to proceed with your loan but we recommend adding {recommendedGas}
								additional ETH to cover network fees.
							</p>
							<Button class="w-40" on:click={() => goto(ROUTES.LOANS_V2_REVIEW)}
								>Review Loan Details</Button
							>
						{:else}
							<p class="text-secondary text-sm">
								We need to transfer {e(toBeTransferred)} ETH more into your Ambos wallet to continue
								with your loan. This includes an additional {recommendedGas} ETH to cover network fees.
								Please use one of the transfer or buy options below.
							</p>
						{/if}
					</div>

					{#if !hasEnough && toBeTransferred > 0}
						<div class="w-full flex justify-between font-bold tracking-wide">
							<p>Amount to deposit (+ Fees)</p>
						</div>
						<div class="border border-secondary p-1 rounded-xl flex">
							<p class="w-full px-4 py-2 font-bold flex items-center justify-between mr-2 text-sm">
								{e(toBeTransferred)} ETH
							</p>
							<Button variant="secondary" class="px-5" on:click={copyBalanceToClipboard}
								>Copy</Button
							>
						</div>
					{/if}
					<NetworkNameLogo />
				</div>
			</Card>
		</Card>
		<Transfer bind:transferred {toBeTransferred} />
	</div>
</BaseScreen>
