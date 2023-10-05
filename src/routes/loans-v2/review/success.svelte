<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ROUTES } from '$lib/constants';
	import { getWeb3Store } from '$lib/context/getStores';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import { f } from '$lib/utils';

	export let borrowAmount = 0;
	export let open: boolean;
	export let finalTxHash: string;

	let web3Store = getWeb3Store();
	$: chainId = $web3Store.chainId ?? 1;
	$: blockExplorer = BLOCK_EXPLORER_URLS[chainId];

	const close = () => (open = false);
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="max-w-[90%] sm:max-w-[425px] flex flex-col gap-4 pb-10 pt-12 text-center bg-popover"
	>
		<div class="flex justify-center items-center py-1">
			<img src="/illustrations/coin.png" alt="coin" class="h-32 w-32" />
		</div>
		<h2 class="font-extrabold text-xl">Loan Request Successful</h2>
		<p class="pb-2">
			You successfully borrowed {f(borrowAmount)} without selling your ETH.
		</p>
		<Button class="rounded-lg bg-popover" variant="outline" on:click={() => goto(ROUTES.LOANS_V2)}
			>Go to Loans</Button
		>
		<Button class="rounded-lg">
			<a class="w-full h-full" href={`${blockExplorer}/tx/${finalTxHash}`} target="_blank"
				>Details</a
			>
		</Button>
	</Dialog.Content>
</Dialog.Root>
