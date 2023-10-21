<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import { getWeb3Store } from '$lib/context/getStores';
	import { e, f } from '$lib/utils';

	let web3Store = getWeb3Store();

	$: usdcBalance = $web3Store.balances.USDC.small ?? 0;
</script>

<Card class="darken-usdc-card-bg text-popover rounded-3xl p-6 flex flex-col gap-2">
	<div class="w-full flex justify-between items-center">
		<div class=" rounded-xl">
			<p class="font-extrabold text-lg">USDC</p>
			<p class="text-sm font-extralight">Your Ambos Wallet</p>
			<p class="text-2xl">{e(usdcBalance)} USDC</p>
		</div>
		<div class="flex flex-col items-end justify-between">
			<div class="h-10 w-10 bg-popover flex items-center justify-center rounded-full">
				<img class="h-7 w-7" src="/external/usdc.png" alt="USDC" />
			</div>
			<slot name="trigger-right" />
		</div>
	</div>
</Card>

<style>
	:global(.darken-usdc-card-bg) {
		background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
			url('/backgrounds/card-dashboard-stable.png');
		background-size: cover;
	}
</style>
