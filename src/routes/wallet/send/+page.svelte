<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import {
		getLatestTransactionOfType,
		TX_STATES_SUMMARY,
		type TXState
	} from '$stores/transactions/state';
	import { BN, cn, f, type EthereumAddress, USDC } from '$lib/utils';
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
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import { sendUSDC, sendWETH } from '$stores/transactions/actions';

	type Token = 'usdc' | 'eth';
	type ValLabel<V, L = string> = { value: V; label: L };
	const tokens: ValLabel<Token>[] = [
		{ value: 'usdc', label: 'USDC' },
		{ value: 'eth', label: 'ETH' }
	];

	let transferValue = 0;
	let warnTransfer = false;
	let selectedTokenInput: ValLabel<Token> = { value: 'usdc', label: 'USDC' };

	let txStore = getTxStore();
	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let isPending = false;
	let destinationAddress: EthereumAddress | undefined;

	$: isValidAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(destinationAddress ?? '');
	$: selectedToken = selectedTokenInput.value;
	$: transaction = getLatestTransactionOfType(
		$txStore,
		selectedToken === 'eth' ? 'SEND_WETH' : 'SEND_USDC'
	);
	$: state = transaction?.state;
	$: seen = transaction?.seen;
	$: address = $accountStore?.address;
	$: provider = $accountStore?.provider;
	$: smartAccount = $accountStore?.smartAccount;
	$: wethBalance = $web3Store.balances['WETH'];
	$: usdcBalance = $web3Store.balances['USDC'];
	$: transferMax = selectedToken === 'eth' ? wethBalance?.small ?? 0 : usdcBalance?.small ?? 0;
	$: transferMaxPretty = selectedToken === 'eth' ? `${transferMax} ETH` : f(transferMax);
	$: transferValuePretty = selectedToken === 'eth' ? `${transferValue} ETH` : f(transferValue);

	$: if (state !== undefined) {
		const [message, showToast] = updateMessage(state, seen);
		if (message && showToast) {
			toast(message);
		}

		if (TX_STATES_SUMMARY['PENDING'].includes(state)) {
			isPending = true;
		} else {
			isPending = false;
		}

		if (state === 'SIGNED') reset();
	}

	$: if (transferValue > transferMax) {
		transferValue = transferMax;
		warnTransfer = true;
		setTimeout(() => {
			warnTransfer = false;
		}, 5000);
	}

	function updateMessage(state: TXState, seen: boolean | undefined): [string, boolean] {
		if (seen) return ['', false];
		switch (state) {
			case 'STARTED':
				return [`Sending ${transferValuePretty}`, false];
			case 'SIGNING':
				return ['Awaiting Signature', true];
			case 'SIGNED':
				return [`${selectedToken.toUpperCase()} transfer being processed`, true];
			case 'FAILED':
				return ['Transfer Failed', true];
			case 'REJECTED':
				return ['Transfer rejected', true];
			case 'SUCCESSFUL':
				return [`Success! Sent ${transferValuePretty}`, true];
			default:
				return ['', false];
		}
	}

	function submit() {
		if (!address || !provider || !smartAccount) {
			console.warn('Missing address, provider, or smartAccount');
			return;
		}

		if (!isValidAddress) {
			console.warn('Invalid address');
			return;
		}

		if (selectedToken === 'eth') {
			sendWETH(
				txStore,
				BN(transferValue),
				destinationAddress as EthereumAddress,
				provider,
				smartAccount
			);
		} else {
			sendUSDC(
				txStore,
				USDC(transferValue),
				destinationAddress as EthereumAddress,
				provider,
				smartAccount
			);
		}
	}

	function reset() {
		transferValue = 0;
	}
</script>

<section class="flex flex-col gap-5 p-4">
	<Card class={cn('w-full')}>
		<CardHeader>
			<div class="flex justify-between mb-5">
				<CardTitle><h1 class="md:text-2xl">Send Funds to another wallet</h1></CardTitle>
			</div>
			<CardDescription>
				<p class="md:text-xl">Send {selectedToken.toUpperCase()} to another wallet or exchange.</p>
			</CardDescription>
		</CardHeader>
		<Separator class=" mb-5" />
		<CardContent>
			<Select.Root bind:selected={selectedTokenInput} onSelectedChange={reset}>
				<Select.Trigger class="">
					<Select.Value placeholder="What do you want to send?" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each tokens as token}
							<Select.Item value={token.value} label={token.label}>{token.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="favoriteFruit" />
			</Select.Root>
			<section class="pt-5 pb-1 flex flex-col gap-5">
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="destination" class="md:text-xl">What address will you send it to?</Label>
					<Input
						class="w-full md:text-xl"
						type="text"
						id="destination"
						placeholder="0x..."
						bind:value={destinationAddress}
					/>
					{#if !isValidAddress && destinationAddress}
						<p class="text-red-500 text-sm md:text-lg">Please enter a valid Ethereum address.</p>
					{/if}
				</div>
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="supply" class="md:text-xl">How much do you want to send?</Label>
					<p class="italic text-sm md:text-lg">
						Max {transferMaxPretty}
					</p>
					{#if warnTransfer}
						<p class="text-red-500 text-sm md:text-lg">
							You can only transfer up to {transferMaxPretty}
						</p>
					{/if}
					<div class="flex gap-1">
						<Input
							class="w-3/4 md:text-xl"
							type="text"
							id="supply"
							placeholder="0"
							bind:value={transferValue}
						/>
						<Button
							class="w-1/4 md:text-xl"
							variant="secondary"
							on:click={() => (transferValue = transferMax)}>Max</Button
						>
					</div>
				</div>
			</section>
		</CardContent>
		<CardFooter>
			<Button
				disabled={isPending || transferValue == 0 || !isValidAddress}
				class="w-full mr-1"
				on:click={submit}
			>
				{#if isPending}
					<LoadingSpinner />
				{:else}
					Submit
				{/if}
			</Button>

			<Button
				class="w-full ml-1 md:text-xl"
				variant="secondary"
				disabled={isPending}
				on:click={reset}>Reset</Button
			>
		</CardFooter>
	</Card>
</section>
