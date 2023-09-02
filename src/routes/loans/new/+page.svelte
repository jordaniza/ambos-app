<script lang="ts">
	import { txStoreFull, type TXStateFull } from '$stores/transactions/state';
	import { accountStore } from '$stores/account';
	import { BN, cn, f } from '$lib/utils';
	import { web3Store } from '$stores/web3';
	import { getCashNow } from '$stores/transactions/batchActions';
	import { InterestRateMode } from '$stores/web3/getPoolData';
	import { ethers } from 'ethers';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import { ChainId } from '@biconomy/core-types';

	import { toast } from 'svelte-sonner';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { APP_NAME } from '$lib/constants';
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogTitle,
		AlertDialogTrigger
	} from '$lib/components/ui/alert-dialog';

	// local variables
	const MAX_PERCENT_BORROW = 0.5; // 50% of the deposit
	let valueDepositUSD = 0;
	let valueBorrowUSD = 0;
	const chainId = ChainId.POLYGON_MUMBAI;
	let warnDeposit = false;
	let warnBorrow = false;

	// reactive variables
	$: state = $txStoreFull['INCREASE_DEBT']?.state;
	$: address = $accountStore?.address;
	$: provider = $accountStore?.provider;
	$: smartAccount = $accountStore?.smartAccount;
	$: hash = $txStoreFull['INCREASE_DEBT']?.receiptHash;

	$: wethBalance = $web3Store.balances['WETH'];
	$: ethPrice = $web3Store.ethPrice;
	$: valueDepositETH = ethPrice.small ? valueDepositUSD / ethPrice.small : 0;

	$: maxDepositUSD = (wethBalance?.small ?? 0) * (ethPrice.small ?? 0);
	$: maxBorrowUSD = valueDepositUSD * MAX_PERCENT_BORROW;

	// watchers
	$: if (state !== undefined) {
		const [message, showToast] = updateMessage(state);
		if (message && showToast) {
			toast(message);
		}
	}

	$: if (valueDepositUSD > maxDepositUSD) {
		valueDepositUSD = maxDepositUSD;
		warnDeposit = true;
		setTimeout(() => {
			warnDeposit = false;
		}, 5000);
	}

	$: if (valueBorrowUSD > maxBorrowUSD) {
		valueBorrowUSD = maxBorrowUSD;
		warnBorrow = true;
		setTimeout(() => {
			warnBorrow = false;
		}, 5000);
	}

	function updateMessage(state: TXStateFull): [string, boolean] {
		switch (state) {
			case 'STARTED':
				return ['Started a new loan.', false];
			case 'SIGNING':
				return ['Awaiting Signature', true];
			case 'SIGNED':
				return ['Loan submitted, awaiting confirmation', true];
			case 'CONFIRMED':
				return ['Transaction confirmed, your loan is being processed.', true];
			case 'FAILED':
				return ['There was a problem processing your loan.', true];
			case 'REJECTED':
				return ['Your loan application was rejected', true];
			case 'SUCCESSFUL':
				return ['Success! Your loan has been processed successfully.', true];
			default:
				return ['', false];
		}
	}

	// methods
	function submit() {
    console.log("CLICKED SUBMIT")
		if (!address || !provider || !smartAccount) {
			console.warn('Missing address, provider, or smartAccount');
			return;
		}
		getCashNow(
			address,
			BN(valueDepositETH),
			// usdc
			ethers.utils.parseUnits(valueBorrowUSD.toString(), 6),
			InterestRateMode.VARIABLE_IR,
			provider,
			smartAccount
		);
	}

	function reset() {
		valueDepositUSD = 0;
		valueBorrowUSD = 0;
	}
</script>

<section class="flex flex-col gap-5 p-4">
	<Card class={cn('w-full')}>
		<CardHeader>
			<div class="flex justify-between mb-5">
				<CardTitle>New Loan</CardTitle>
			</div>
			<CardDescription>
				With {APP_NAME} you can deposit ETH and borrow USDC. You can borrow up to 50% of the current
				value of your deposit.
				<br />
				<br />
				Adjust the parameters below to set the dollar value of the amounts you want to deposit and borrow.
			</CardDescription>
		</CardHeader>

		<Separator class=" mb-5" />
		<CardContent>
			<section class="pt-5 pb-10 flex flex-col gap-10">
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="supply">How much do you want to supply in USD?</Label>
					<p class="italic text-sm">Max {f(maxDepositUSD)} ({wethBalance?.small ?? 0} ETH)</p>
					{#if warnDeposit}
						<p class="text-red-500 text-sm">You can only supply up to {f(maxDepositUSD)}</p>
					{/if}
					<div class="flex gap-1">
						<Input
							class="w-3/4"
							type="text"
							id="supply"
							placeholder="0"
							bind:value={valueDepositUSD}
						/>
						<Button
							class="w-1/4"
							variant="secondary"
							on:click={() => (valueDepositUSD = maxDepositUSD)}>Max</Button
						>
					</div>
				</div>
				<div class="grid w-full max-w-sm items-center gap-1">
					<Label for="borrow">How much do you want to borrow in USD?</Label>
					<p class="italic text-sm">Max {f(maxBorrowUSD)}</p>
					{#if warnBorrow}
						<p class="text-red-500 text-sm">You can only borrow up to {f(maxBorrowUSD)}</p>
					{/if}
					<div class="flex gap-1">
						<Input
							class="w-3/4"
							type="text"
							id="borrow"
							placeholder="0"
							bind:value={valueBorrowUSD}
						/>
						<Button
							class="w-1/4"
							variant="secondary"
							on:click={() => (valueBorrowUSD = maxBorrowUSD)}>Max</Button
						>
					</div>
				</div>
			</section>

			<section class="p-4 flex flex-col gap-5 rounded border border-gray-300 my-3">
				<div class="flex justify-between items-center">
					<span class=" font-bold">Depositing</span>
					<span class=" font-semibold">{f(valueDepositUSD)} ({valueDepositETH} ETH)</span>
				</div>
				<div class="flex justify-between items-center">
					<span class="font-bold">Borrowing</span>
					<span class="font-semibold">{f(valueBorrowUSD ?? 0)}</span>
				</div>
			</section>
		</CardContent>
		<CardFooter>
			<AlertDialog>
				<AlertDialogTrigger asChild let:builder>
					<Button disabled={valueBorrowUSD==0} class="w-full mr-1" builders={[builder]}>Submit</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Loan</AlertDialogTitle>
						<section class="p-4 flex flex-col gap-5 rounded border border-gray-300 my-3">
							<div class="flex justify-between items-center">
								<span class=" font-bold">Depositing</span>
								<span class=" font-semibold">{f(valueDepositUSD)} ({valueDepositETH} ETH)</span>
							</div>
							<div class="flex justify-between items-center">
								<span class=" font-bold">Borrowing</span>
								<span class=" font-semibold">{f(valueBorrowUSD ?? 0)}</span>
							</div>
						</section>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction>
              <Button variant="ghost" on:click={submit}>Confirm</Button>  
            </AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Button class="w-full ml-1" variant="secondary" on:click={reset}>Reset</Button>
		</CardFooter>
	</Card>


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
</section>
