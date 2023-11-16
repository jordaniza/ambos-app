<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ROUTES } from '$lib/constants';
	import { f } from '$lib/utils';

	export let borrowAmount: number | undefined;
	export let ethSupplied: number | undefined;
	export let open: boolean;

	function handleGoToWallet() {
		open = false;
		goto(ROUTES.WALLET);
	}

	function handleBankTransfer() {
		open = false;
		const url = `${ROUTES.LOANS_V2_BANK_TRANSFER}?deltaEth=${ethSupplied}&deltaUSDC=${borrowAmount}`;
		goto(url);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="max-w-[90%] sm:max-w-[425px] flex flex-col gap-4 pb-10 pt-12 text-center bg-popover"
	>
		<div class="flex justify-center items-center py-1">
			<img src="/illustrations/coin.png" alt="coin" class="h-32 w-32" />
		</div>
		<h2 class="font-extrabold text-xl">Loan Request Successful</h2>
		{#if borrowAmount}
			<p class="pb-2">
				You successfully borrowed {f(borrowAmount)} without selling your ETH.
			</p>
		{:else}
			<p class="pb-2">You successfully borrowed without selling your ETH.</p>
		{/if}
		<Button class="rounded-lg" on:click={handleBankTransfer}>Transfer to your bank</Button>
		<Button class="rounded-lg bg-popover" variant="outline" on:click={handleGoToWallet}
			>Go to Wallet</Button
		>
	</Dialog.Content>
</Dialog.Root>
