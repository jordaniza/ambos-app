<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import {
		ArrowDownRight,
		ArrowDownRightIcon,
		ArrowLeftRightIcon,
		CloudLightningIcon,
		CupSodaIcon,
		DollarSignIcon,
		LogInIcon,
		ReceiptIcon,
		WalletIcon,
		ZapIcon
	} from 'lucide-svelte';
	import WithStablecoin from './with-stablecoin.svelte';
	import Ramp from '$lib/components/ramp/ramp.svelte';

	export let open = false;

	let openRepayWithStablecoin = false;
	let openTransak = false;

	function handleClick() {
		openRepayWithStablecoin = true;
		open = false;
	}

	function handleClickBuy() {
		openTransak = true;
		open = false;
	}

	const options = {
		defaultCryptoCurrency: 'USDC',
		cryptoCurrencyList: 'USDC',
		exchangeScreenTitle: 'Buy USDC'
	};
</script>

<WithStablecoin bind:open={openRepayWithStablecoin} />

<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Repayment Options</Dialog.Title>
		<div class="flex w-full flex-col p-4 gap-5">
			<!-- From your wallet -->
			<div class="flex w-full flex-col gap-2">
				<div class="flex w-full items-center">
					<div class="grow flex gap-2 items-center">
						<WalletIcon class="h-4 w-4 text-muted-foreground" />
						<p class="font-bold">From Your Wallet</p>
					</div>
					<!-- Cant work out why but this opens automatically atm -->
					<!-- <TooltipIcon text={TOOLTIPS.REPAY_FROM_WALLET} /> -->
				</div>

				<!-- <button
					on:click={handleClick}
					class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
				>
					<div class="flex items-center gap-2">
						<img src="/external/eth.png" alt="eth" class="h-8 w-8" />
						<p class="font-bold">Convert ETH</p>
					</div>
					<ArrowLeftRightIcon class="h-6 w-6 text-primary" />
				</button> -->

				<button
					on:click={handleClick}
					class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
				>
					<div class="flex items-center gap-2">
						<DollarSignIcon class="h-7 w-7 ml-1 text-secondary" />
						<p class="font-bold">Use USDC</p>
					</div>
					<WalletIcon class="h-6 w-6 text-primary" />
				</button>
			</div>

			<!-- Flash Loan -->
			<!-- <div class="flex w-full flex-col gap-2">
				<div class="flex w-full items-center">
					<div class="grow flex gap-2 items-center">
						<ZapIcon class="h-4 w-4 text-muted-foreground" />
						<p class="font-bold">With Collateral</p>
					</div>
					<TooltipIcon text={TOOLTIPS.REPAY_WITH_COLLATERAL} />
				</div>

				<button
					on:click={handleClick}
					class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
				>
					<div class="flex items-center gap-2">
						<img src="/external/eth.png" alt="eth" class="h-8 w-8" />
						<p class="font-bold">Pay from Collateral</p>
					</div>
					<CupSodaIcon class="h-6 w-6 text-primary" />
				</button>
			</div> -->

			<!-- External Source -->

			<div class="flex w-full flex-col gap-2">
				<div class="flex w-full items-center">
					<div class="grow flex gap-2 items-center">
						<LogInIcon class="h-4 w-4 text-muted-foreground" />
						<p class="font-bold">External Source</p>
					</div>
					<!-- <TooltipIcon text={TOOLTIPS.REPAY_FROM_TRANSFER} /> -->
				</div>

				<!-- <button
					on:click={handleClick}
					class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
				>
					<div class="flex items-center gap-2">
						<DollarSignIcon class="h-7 w-7 ml-1 text-secondary" />
						<p class="font-bold">Transfer USDC</p>
					</div>
					<ArrowDownRightIcon class="h-6 w-6 text-primary" />
				</button> -->

				<button
					on:click={handleClickBuy}
					class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
				>
					<div class="flex items-center gap-2">
						<DollarSignIcon class="h-7 w-7 ml-1 text-secondary" />
						<p class="font-bold">Buy USDC</p>
					</div>
					<ReceiptIcon class="h-6 w-6 text-primary" />
				</button>
			</div>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>

<Dialog.Root bind:open={openTransak}>
	<Dialog.FlyInContent class="bg-popover">
		<div class="flex w-full flex-col gap-5">
			<p class="font-3xl font-extrabold text-center">Buy USDC</p>
			<Ramp class="border-0 h-[600px] w-full" {options} direction="buy" />
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
