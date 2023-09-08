<script lang="ts">
	import {
		getLatestTransactionOfType,
		TX_STATES_SUMMARY,
		type TXState
	} from '$stores/transactions/state';
	import { BN, cn, f } from '$lib/utils';
	import { getCashNow } from '$stores/transactions/batchActions';
	import { InterestRateMode } from '$stores/web3/getPoolData';
	import { ethers } from 'ethers';
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
		AlertDialogTitle,
		AlertDialogTrigger
	} from '$lib/components/ui/alert-dialog';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';

	// local variables
	const MAX_PERCENT_BORROW = 0.5; // 50% of the deposit
	let valueDepositUSD = 0;
	let valueBorrowUSD = 0;
	let warnDeposit = false;
	let warnBorrow = false;

	let txStore = getTxStore();
	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let isPending = false;

	// reactive variables
	$: transaction = getLatestTransactionOfType($txStore, 'INCREASE_DEBT');
	$: state = transaction?.state;
	$: seen = transaction?.seen;
	$: address = $accountStore?.address;
	$: provider = $accountStore?.provider;
	$: smartAccount = $accountStore?.smartAccount;
	$: wethBalance = $web3Store.balances['WETH'];
	$: ethPrice = $web3Store.ethPrice;
	$: valueDepositETH = ethPrice.small ? valueDepositUSD / ethPrice.small : 0;
	$: maxDepositUSD = (wethBalance?.small ?? 0) * (ethPrice.small ?? 0);
	$: maxBorrowUSD = valueDepositUSD * MAX_PERCENT_BORROW;
	$: interestRate = $web3Store.poolReserveData?.variableBorrowingRate.small ?? 0;

	// watchers
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
		// depending on the state, reset the form
		if (state === 'SIGNED') reset();
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

	function updateMessage(state: TXState, seen: boolean | undefined): [string, boolean] {
		if (seen) return ['', false];
		switch (state) {
			case 'STARTED':
				return ['Started a new loan.', false];
			case 'SIGNING':
				return ['Awaiting Signature', true];
			case 'SIGNED':
				return ['Loan submitted, your loan is being processed', true];
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
		if (!address || !provider || !smartAccount) {
			console.warn('Missing address, provider, or smartAccount');
			return;
		}
		getCashNow(
			txStore,
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
				<CardTitle><h1 class="md:text-2xl">New Loan</h1></CardTitle>
			</div>
			<CardDescription>
				<p class="md:text-xl">
					With {APP_NAME} you can deposit ETH and borrow USDC. You can borrow up to 50% of the current
					value of your deposit.
					<br />
					<br />
					Adjust the parameters below to set the dollar value of the amounts you want to deposit and
					borrow.
				</p>
			</CardDescription>
		</CardHeader>

		<Separator class=" mb-5" />
		<CardContent>
			<section class="pt-5 pb-10 flex flex-col gap-10">
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="supply" class="md:text-xl">How much do you want to supply in USD?</Label>
					<p class="italic text-sm md:text-lg">
						Max {f(maxDepositUSD)} ({wethBalance?.small ?? 0} ETH)
					</p>
					{#if warnDeposit}
						<p class="text-red-500 text-sm md:text-lg">
							You can only supply up to {f(maxDepositUSD)}
						</p>
					{/if}
					<div class="flex gap-1">
						<Input
							class="w-3/4 md:text-xl"
							type="text"
							id="supply"
							placeholder="0"
							bind:value={valueDepositUSD}
						/>
						<Button
							class="w-1/4 md:text-xl"
							variant="secondary"
							on:click={() => (valueDepositUSD = maxDepositUSD)}>Max</Button
						>
					</div>
				</div>
				<div class="grid w-full max-w-sm items-center gap-1">
					<Label for="borrow" class="md:text-xl">How much do you want to borrow in USD?</Label>
					<p class="italic text-sm md:text-lg">Max {f(maxBorrowUSD)}</p>
					{#if warnBorrow}
						<p class="text-red-500 text-sm md:text-lg">
							You can only borrow up to {f(maxBorrowUSD)}
						</p>
					{/if}
					<div class="flex gap-1">
						<Input
							class="w-3/4 md:text-xl"
							type="text"
							id="borrow"
							placeholder="0"
							bind:value={valueBorrowUSD}
						/>
						<Button
							class="w-1/4 md:text-xl"
							variant="secondary"
							on:click={() => (valueBorrowUSD = maxBorrowUSD)}>Max</Button
						>
					</div>
				</div>
			</section>
			<section class="p-4 flex flex-col gap-5 rounded border border-gray-300 my-3">
				<div class="flex justify-between items-center">
					<span class="md:text-xl font-bold">Depositing</span>
					<span class="md:text-xl font-semibold">{f(valueDepositUSD)} ({valueDepositETH} ETH)</span>
				</div>
				<div class="flex justify-between items-center">
					<span class="md:text-xl font-bold">Borrowing</span>
					<span class="md:text-xl font-semibold">{f(valueBorrowUSD ?? 0)}</span>
				</div>
				<div class="flex justify-between items-center">
					<span class="md:text-xl font-bold">Interest Rate</span>
					<span class="md:text-xl font-semibold">{interestRate.toFixed(2)}%</span>
				</div>
			</section>
		</CardContent>
		<CardFooter>
			<AlertDialog>
				<AlertDialogTrigger asChild let:builder>
					<Button
						disabled={isPending || valueBorrowUSD == 0}
						class="w-full mr-1"
						builders={[builder]}
					>
						{#if isPending}
							<LoadingSpinner />
						{:else}
							Submit
						{/if}
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle><p class="md:text-xl md:my-2">Confirm Loan</p></AlertDialogTitle>
						<section class="p-4 flex flex-col gap-5 rounded border border-gray-300 my-3">
							<div class="flex justify-between items-center">
								<span class="md:text-xl font-bold">Depositing</span>
								<span class="md:text-xl font-semibold"
									>{f(valueDepositUSD)} ({valueDepositETH} ETH)</span
								>
							</div>
							<div class="flex justify-between items-center">
								<span class="md:text-xl font-bold">Borrowing</span>
								<span class="md:text-xl font-semibold">{f(valueBorrowUSD ?? 0)}</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="md:text-xl font-bold">Interest Rate</span>
								<span class="md:text-xl font-semibold">{interestRate.toFixed(2)}%</span>
							</div>
						</section>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel><p class="md:text-xl">Cancel</p></AlertDialogCancel>
						<AlertDialogAction>
							<Button variant="ghost" class="md:text-xl w-full" on:click={submit}>Confirm</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Button
				class="w-full ml-1 md:text-xl"
				variant="secondary"
				disabled={isPending}
				on:click={reset}>Reset</Button
			>
		</CardFooter>
	</Card>
</section>
