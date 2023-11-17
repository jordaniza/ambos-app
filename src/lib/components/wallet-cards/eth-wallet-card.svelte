<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import { getWeb3Store } from '$lib/context/getStores';
	import { CHAIN_ETH_TYPE } from '$lib/contracts';
	import { e } from '$lib/utils';

	let web3Store = getWeb3Store();

	$: chainId = $web3Store.chainId ?? 1;
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';
	$: ethBalance = $web3Store?.balances[ethType].small ?? 0;
</script>

<Card
	class="bg-[url('/backgrounds/card-dashboard-eth.png')] text-popover rounded-3xl p-6 flex flex-col gap-2"
>
	<div class="w-full flex justify-between items-center">
		<div class=" rounded-xl">
			<p class="font-extrabold text-lg">ETH</p>
			<p class="text-sm font-extralight text-popover">Your Ambos Wallet</p>
			<p class="text-2xl">{e(ethBalance)} ETH</p>
		</div>
		<div class="flex flex-col items-end justify-between">
			<div class="h-10 w-10 bg-popover flex items-center justify-center rounded-full">
				<img class="h-7 w-7" src="/external/eth.png" alt="ETH" />
			</div>
			<slot name="trigger-right" />
		</div>
	</div>
</Card>
