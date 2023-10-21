<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import { ROUTES } from '$lib/constants';
	import { e, f } from '$lib/utils';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import EthWalletCard from '$lib/components/wallet-cards/eth-wallet-card.svelte';
	import UsdcWalletCard from '$lib/components/wallet-cards/usdc-wallet-card.svelte';
	import NetworkNameLogo from '$lib/components/ui/network/network-name-logo.svelte';
	import Counter from '$lib/components/ui/counter/counter.svelte';
	import Ramp from '$lib/components/ramp/ramp.svelte';
	import { page } from '$app/stores';

	let deltaEth = $page.url.searchParams.get('deltaEth');
	let deltaUSDC = $page.url.searchParams.get('deltaUSDC');

	$: eth = Number.isNaN(deltaEth) ? undefined : Number(deltaEth);
	$: usdc = Number.isNaN(deltaUSDC) ? undefined : Number(deltaUSDC);

	function formatUSDCTicker(n: number) {
		return `+ ${f(n)}`;
	}

	function formatETHTicker(n: number) {
		return `- ${e(n)} ETH`;
	}
	const options = {
		defaultCryptoCurrency: 'USDC',
		cryptoCurrencyList: 'USDC',
		exchangeScreenTitle: 'Sell To Your Bank'
	};
</script>

<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans-2.png')]"
	/>
	<div slot="header" class="pb-5">
		<BackButton backTo={ROUTES.DASHBOARD_V2} />
		<div class="pt-5 px-4">
			<h1 class="font-extrabold text-2xl pb-3 tracking-widest">Transfer to your bank</h1>
			<p>Transfer ETH or Stablecoins to your bank in just one click</p>
		</div>
	</div>
	<div slot="card" class="p-4 flex flex-col gap-5">
		<!-- Review Params -->
		<Card class="bg-popover px-4 py-4 flex flex-col gap-4">
			<EthWalletCard>
				<div slot="trigger-right" class="flex items-center justify-center">
					{#if eth}
						<Counter class="text-secondary pt-2 text-xl" target={eth} formatter={formatETHTicker} />
					{/if}
				</div>
			</EthWalletCard>
			<Card class="flex justify-between px-3 py-2 text-sm shadow-none">
				<NetworkNameLogo />
				<div class="flex items-center justify-end gap-2">
					<p>ETH</p>
					<TooltipIcon text={TOOLTIPS.NETWORK} />
				</div></Card
			>
		</Card>
		<Card padding="base" variant="popover" class="flex flex-col gap-5 pt-4">
			<UsdcWalletCard>
				<div slot="trigger-right" class="flex items-center justify-center">
					{#if usdc}
						<Counter class="text-primary pt-2 text-xl" target={usdc} formatter={formatUSDCTicker} />
					{/if}
				</div>
			</UsdcWalletCard>
			<Ramp class="border-0 h-[600px] w-full" {options} direction="sell" />
		</Card>
	</div>
</BaseScreen>
