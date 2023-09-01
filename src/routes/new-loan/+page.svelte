<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { txStoreFull } from '$stores/transactions/state';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { accountStore } from '$stores/account';
	import { BN } from '$lib/utils';
	import { web3Store } from '$stores/web3';
	import { getCashNow } from '$stores/transactions/batchActions';
	import { InterestRateMode } from '$stores/web3/getPoolData';
	import { ethers } from 'ethers';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import { ChainId } from '@biconomy/core-types';

	// local variables
	const toastStore = getToastStore();
	const MAX_PERCENT_BORROW = 0.5; // 50% of the deposit
	let valueDeposit = 0;
	let valueBorrow = 0;
  const chainId = ChainId.POLYGON_MUMBAI;
	const { format } = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	// reactive variables
	$: state = $txStoreFull['INCREASE_DEBT']?.state;
	$: address = $accountStore?.address;
	$: provider = $accountStore?.provider;
	$: smartAccount = $accountStore?.smartAccount;

	$: wethBalance = $web3Store.balances['WETH'];
	$: ethPrice = $web3Store.ethPrice;

	$: maxDepositUSD = (wethBalance?.small ?? 0) * (ethPrice.small ?? 0);
	$: maxDeposit = wethBalance?.small || 0;
	$: valueDepositUSD = valueDeposit * (ethPrice.small ?? 0);
	$: maxBorrowUSD = valueDepositUSD * MAX_PERCENT_BORROW;

	// watchers
	$: if (state !== undefined) {
		toastStore.clear();
		toastStore.trigger({
			message: `Transaction state has changed to ${state}`
		});
	}

	$: if (valueBorrow > maxBorrowUSD) {
		valueBorrow = maxBorrowUSD;
	}

	$: hash = $txStoreFull['INCREASE_DEBT']?.receiptHash;

	// methods
	function submit() {
		if (!address || !provider || !smartAccount) {
			console.warn('Missing address, provider, or smartAccount');
			return;
		}
		getCashNow(
			address,
			BN(valueDeposit),
			// usdc
			ethers.utils.parseUnits(valueBorrow.toString(), 6),
			InterestRateMode.VARIABLE_IR,
			provider,
			smartAccount
		);
	}
</script>

<div class="card m-2 p-2 rounded">
	<header class="card-header">New Loan</header>
	<section class="p-4">
		<RangeSlider name="range-slider" bind:value={valueDeposit} max={maxDeposit} step={0.1}>
			<div class="flex flex-col">
				<div class="font-bold">How much do you want to Deposit</div>
				<div class="text-xs">{format(valueDepositUSD)} / {format(maxDepositUSD)}</div>
				<div class="text-xs">1 WETH = {format(ethPrice.small ?? 0)} USD</div>
			</div>
		</RangeSlider>
		<RangeSlider name="range-slider" bind:value={valueBorrow} max={maxBorrowUSD} step={10}>
			<div class="flex flex-col">
				<div class="font-bold">How much do you want to borrow?</div>
				<div class="text-xs">{format(valueBorrow)} / {format(maxBorrowUSD)}</div>
			</div>
		</RangeSlider>
	</section>
	<section class="flex flex-col p-4">
		<div class="font-bold">Depositing {valueDeposit} Eth</div>
		<div class="font-bold">Borrowing {format(valueBorrow)}</div>
	</section>
	<footer class="card-footer">
		<button type="button" class="btn variant-filled" on:click={submit}>LEGGO</button>
	</footer>
</div>

{#if state}
	<div class="card m-2 p-2 rounded">
		<dl class="list-dl">
			<div>
				<span class="flex-auto">
					<dt>Transaction Status</dt>
					<dd>State: {state}</dd>
					{#if hash}
						<a
							href={`${BLOCK_EXPLORER_URLS[chainId]}/tx/${hash}`}
							target="_blank"
							class="text-blue-500 underline">View Transaction</a
						>
					{/if}
				</span>
			</div>
		</dl>
	</div>
{/if}
