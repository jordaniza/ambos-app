<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { e, f } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ROUTES } from '$lib/constants';
	import { goto } from '$app/navigation';
	import { CheckCircle2 } from 'lucide-svelte';
	import Counter from '$lib/components/ui/counter/counter.svelte';
	import { getWeb3Store } from '$lib/context/getStores';
	import EthWalletCard from '$lib/components/wallet-cards/eth-wallet-card.svelte';

	export let open = false;
	export let removeQty: number;

	let web3Store = getWeb3Store();

	$: outstandingCollateral = $web3Store.userPoolData.totalCollateralBase.small ?? 0;

	function handleGoBack() {
		open = false;
		goto(ROUTES.LOANS_V2);
	}

	function formatter(n: number) {
		return e(n) + ' ETH';
	}
</script>

<!-- Repay from Wallet -->
<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center"
			>Remove Collateral Successful</Dialog.Title
		>
		<CheckCircle2 class="h-20 w-20 text-primary mx-auto stroke-1" />
		<EthWalletCard>
			<div slot="trigger-right" class="flex items-center justify-center">
				{#if removeQty}
					<Counter class="text-secondary pt-2 text-xl" target={removeQty} {formatter} />
				{/if}
			</div>
		</EthWalletCard>
		<div class="flex flex-col gap-5 text-sm">
			<div class="flex flex-col text-base gap-2">
				<div class="flex justify-between">
					<p>Remaining Collateral:</p>
					<p class="text-secondary">{f(outstandingCollateral)}</p>
				</div>
			</div>
		</div>
		<Button
			variant="outline"
			class="mb-2 mt-1 w-full border-secondary text-secondary"
			on:click={handleGoBack}>Back to Loans</Button
		>
	</Dialog.FlyInContent>
</Dialog.Root>
