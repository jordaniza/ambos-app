<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { USDC, e, f, stbl } from '$lib/utils';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { decreaseDebt, getDecreaseDebtFeeQuote } from '$stores/transactions/batchActions';
	import { makeTxId } from '$stores/transactions/state';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import UsdcWalletCard from '$lib/components/wallet-cards/usdc-wallet-card.svelte';
	import { onMount } from 'svelte';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import { CHAIN_ETH_TYPE } from '$lib/contracts';
	import EthWalletCard from '$lib/components/wallet-cards/eth-wallet-card.svelte';

	export let open = true;

	let pending = false;
	let removeQty = 0;
	let checked: boolean = false;
	let txStore = getTxStore();
	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();
	let estimatedFee = 0;
	let id: string = '';

	$: chainId = $web3Store.chainId ?? 1;
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';

	$: ethBalance = $web3Store?.balances[ethType].small ?? 0;
	$: supplied = $web3Store?.balances['aWETH'].small ?? 0;
	$: debtValue = $web3Store?.userPoolData?.totalDebtBase?.small ?? 0;
	$: collateralValue = $web3Store?.userPoolData?.totalCollateralBase?.small ?? 0;

	$: ethPrice = $web3Store?.ethPrice?.small ?? 0;

	$: maxDebt = collateralValue / 2;
	$: capacity = maxDebt - debtValue;
	$: maxRemove = Math.max(capacity, 0);
	$: showWarning = removeQty === maxRemove && maxRemove < supplied;

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
		return e(removeQty) + ' ETH';
	}

	function maxFormatter() {
		return e(maxRemove) + ' ETH';
	}

	function handleClick() {
		if (!smartAccount || !provider || !address) return;
		pending = true;
		id = makeTxId();
		decreaseDebt({
			store: txStore,
			repayAmountinUSDC: USDC(removeQty),
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
			repayAmountinUSDC: USDC(removeQty),
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
		<Dialog.Title class="font-xl font-extrabold text-center">Remove ETH</Dialog.Title>

		<div class="flex flex-col gap-5 text-sm">
			<div class="flex flex-col text-base gap-2">
				<div class="flex justify-between">
					<p>Collateral Value:</p>
					<p class="text-secondary">{f(collateralValue)} / {e(supplied)} ETH</p>
				</div>
				<div class="flex justify-between">
					<p>Debt Value:</p>
					<p class="text-secondary">{f(debtValue)}</p>
				</div>
			</div>
			<!-- Wallet balance and 'credit card' -->
			<EthWalletCard />
			<InputEditSlider
				showRange={true}
				max={maxRemove}
				showMax={true}
				{maxFormatter}
				title="How much ETH do you want to withdraw from your collateral?"
				step={0.001}
				bind:value={removeQty}
				{formatter}
			/>
			{#if showWarning}<p class="text-xs text-destructive text-center -mt-5">
					You must maintain at least 50% of your debt in collateral to avoid liquidation, you can
					withdraw up to {f(maxRemove)} in ETH
				</p>
			{/if}

			<div class="rounded-2xl px-4 py-2 bg-background flex justify-between">
				<div class="flex gap-2">
					<p>Network Fee</p>
					<TooltipIcon text={TOOLTIPS.GAS_FEES} />
				</div>
				<div class="flex gap-2">
					<p>{estimatedFee === 0 ? 'Pending...' : f(estimatedFee)}</p>
				</div>
			</div>
			<div class="flex gap-2 items-center justify-center">
				<button on:click={() => (checked = !checked)} class="text-xs font-bold"
					>I have reviewed the loan terms and understand that removing collateral increases my risk
					of liquidation</button
				>
				<Checkbox bind:checked />
			</div>
			<Button disabled={!checked || removeQty === 0} on:click={handleClick}>
				{#if pending}
					<LoadingSpinner class="h-5 w-5 text-popover animate-spin" />
				{:else}
					Remove Collateral
				{/if}
			</Button>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
