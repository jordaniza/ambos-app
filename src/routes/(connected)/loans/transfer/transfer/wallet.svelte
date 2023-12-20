<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import { getAccountStore, getTxStore } from '$lib/context/getStores';
	import { e } from '$lib/utils';
	import { sendETHFromEOA } from '$stores/transactions/actions';
	import { makeTxId } from '$stores/transactions/state';
	import { BigNumber, ethers } from 'ethers';
	import { Wallet2Icon } from 'lucide-svelte';

	export let startVerification: boolean;
	export let showVerification: boolean;

	let accountStore = getAccountStore();
	let txStore = getTxStore();

	let txId: string;
	let accountEthBalance = {
		small: 0,
		large: BigNumber.from(0)
	};
	let transferQtyInEth = 0;

	$: eoa = $accountStore.eoa;
	$: eoaTruncated = eoa ? eoa.slice(0, 6) + '...' + eoa.slice(-4) : '';
	$: address = $accountStore.address;
	$: provider = $accountStore.provider;
	$: transaction = txId && $txStore.transactions[txId];
	$: isLoading = transaction && ['STARTED', 'SIGNING'].includes(transaction.state);

	async function getEoaBalance() {
		if (!eoa || !provider) return;
		const balance = await provider.getBalance(eoa);
		accountEthBalance = {
			small: Number(ethers.utils.formatEther(balance)),
			large: balance
		};
	}

	function handleSubmit() {
		if (!address || !provider || !eoa) {
			console.warn('Missing address, provider, or smartAccount');
			return;
		}

		txId = makeTxId();

		sendETHFromEOA({
			id: txId,
			store: txStore,
			amount: ethers.utils.parseEther(transferQtyInEth.toString()),
			provider,
			destinationAddress: address,
			eoa
		});
	}

	$: {
		if (transaction) {
			showVerification = transaction.state === 'SIGNED';
			startVerification = transaction.state === 'SIGNED';
		}
	}

	function formatter() {
		return e(transferQtyInEth) + ' ETH';
	}

	function maxFormatter() {
		return e(accountEthBalance.small) + ' ETH';
	}

	$: {
		if (eoa && provider) {
			getEoaBalance();
		}
	}
</script>

<Card class="flex flex-col text-sm gap-2 justify-center text-start p-4 shadow-none ">
	<div class="flex items-center gap-2 pb-2">
		<Wallet2Icon class="w-4 h-4 text-muted-foreground" />
		<p>
			Transfer from <span class="font-mono inline-block">{eoaTruncated}</span>
		</p>
	</div>
	<InputEditSlider
		title="How much ETH would you like to transfer?"
		bind:value={transferQtyInEth}
		{formatter}
		max={accountEthBalance.small}
		{maxFormatter}
		showMax={true}
		showRange={true}
		step={0.01}
	/>
	<Button disabled={isLoading || transferQtyInEth === 0} class="mt-4" on:click={handleSubmit}>
		{#if isLoading}
			<LoadingSpinner />
		{:else}
			Transfer
		{/if}
	</Button>
</Card>
