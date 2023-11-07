<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { USDC, f, stbl } from '$lib/utils';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { decreaseDebt, getDecreaseDebtFeeQuote } from '$stores/transactions/batchActions';
	import { makeTxId } from '$stores/transactions/state';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import UsdcWalletCard from '$lib/components/wallet-cards/usdc-wallet-card.svelte';
	import { onMount } from 'svelte';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';

	export let open = false;

	let pending = false;
	let repayQty = 0;
	let checked: boolean = false;
	let txStore = getTxStore();
	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();
	let estimatedFee = 0;
	let id: string = '';

	$: usdcBalance = $web3Store?.balances.USDC.small ?? 0;
	$: borrowed = $web3Store.userPoolData.totalDebtBase.small ?? 0;

	$: maxRepay = Math.min(usdcBalance, borrowed);
	$: showWarning = repayQty === maxRepay && maxRepay < borrowed;

	$: smartAccount = $accountStore?.smartAccount;
	$: provider = $accountStore?.provider;
	$: address = $accountStore?.address;

	$: tx = $txStore.transactions[id];

	// listen for a tx past the signed stage and shut the modal
	$: {
		if (['SIGNED', 'SUCCESSFUL'].includes(tx?.state)) {
			open = false;
		}
	}

	function formatter() {
		return stbl(repayQty, 'USDC');
	}

	function maxFormatter() {
		return stbl(maxRepay, 'USDC');
	}

	function handleClick() {
		if (!smartAccount || !provider || !address) return;
		pending = true;
		id = makeTxId();
		decreaseDebt({
			store: txStore,
			repayAmountinUSDC: USDC(repayQty),
			id,
			borrower: address,
			smartAccount,
			provider
		}).finally(() => {
			pending = false;
		});
	}

	function getFeeQuote() {
		if (!smartAccount || !provider || !address) return;
		getDecreaseDebtFeeQuote({
			borrower: address,
			repayAmountinUSDC: USDC(repayQty),
			smartAccount,
			provider
		}).then((quote) => {
			if (!quote || !quote.maxGasFeeUSD) {
				console.error('Failed to get fee quote');
				return;
			}
			estimatedFee = quote.maxGasFeeUSD;
		});
	}

	onMount(() => {
		getFeeQuote();
	});
</script>

<!-- Repay from Wallet -->
<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Repay With USDC</Dialog.Title>

		<div class="flex flex-col gap-5 text-sm">
			<div class="flex flex-col text-base gap-2">
				<div class="flex justify-between">
					<p>Outstanding Amount:</p>
					<p class="text-secondary">{f(borrowed)}</p>
				</div>
			</div>
			<!-- Wallet balance and 'credit card' -->
			<UsdcWalletCard />
			<InputEditSlider
				showRange={true}
				max={maxRepay}
				showMax={true}
				{maxFormatter}
				title="How much USDC do you want to use to repay the loan?"
				step={0.01}
				bind:value={repayQty}
				{formatter}
			/>
			{#if showWarning}<p class="text-xs text-destructive text-center -mt-5">
					Add more USDC to your Ambos wallet to repay the rest of the loan
				</p>
			{/if}

			<div class="rounded-2xl px-4 py-2 bg-background flex justify-between">
				<div class="flex gap-2">
					<p>Network Fee</p>
					<TooltipIcon text={TOOLTIPS.GAS_FEES_ERC20} />
				</div>
				<div class="flex gap-2">
					<p>{estimatedFee === 0 ? 'Pending...' : f(estimatedFee)}</p>
				</div>
			</div>
			<div class="flex gap-2 items-center justify-center">
				<button on:click={() => (checked = !checked)} class="text-xs font-bold"
					>I have reviewed and confirm that I want to repay the loan.</button
				>
				<Checkbox bind:checked />
			</div>
			<Button disabled={!checked || repayQty === 0} on:click={handleClick}>
				{#if pending}
					<LoadingSpinner class="h-5 w-5 text-popover animate-spin" />
				{:else}
					Repay Loan
				{/if}
			</Button>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
