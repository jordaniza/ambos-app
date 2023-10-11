<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getWeb3Store } from '$lib/context/getStores';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { e, f } from '$lib/utils';
	import InputEditSlider from '../../loans/review/input-edit-slider.svelte';
	import NetworkLogos from '$lib/components/ui/network/network-logos.svelte';
	import NetworkNames from '$lib/components/ui/network/network-names.svelte';
	import { ScanLineIcon } from 'lucide-svelte';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';

	export const trigger = () => {
		open = true;
	};
	export let open = false;
	export let currency: 'ETH' | 'USDC' = 'ETH';

	let web3Store = getWeb3Store();
	let checked: boolean = false;
	let openWithdraw = false;
	let withdrawQty = 0;
	let sendAddress = '0x....';

	$: ethBalance = $web3Store.balances.WETH.small ?? 0;
	$: ethPrice = $web3Store.ethPrice?.small ?? 0;
	$: usdcBalance = $web3Store.balances.USDC.small ?? 0;
	$: withdrawETHUSDValue = withdrawQty * ethPrice;

	function handleClick(chosenCurrency: 'ETH' | 'USDC') {
		currency = chosenCurrency;
		openWithdraw = true;
		open = false;
	}

	function handleWithdraw() {
		toast.success('Withdrawn');
	}

	function formatter() {
		if (currency === 'ETH') return `${e(withdrawQty)} ${currency} - ${f(withdrawETHUSDValue)}`;
		else return f(withdrawETHUSDValue);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Receive/Transfer</Dialog.Title>
		<div class="flex flex-col p-4 gap-3">
			<button
				on:click={() => handleClick('ETH')}
				class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
			>
				<div class="flex items-center gap-2">
					<img src="/external/eth.png" alt="eth" class="h-8 w-8" />
					<p>Ether</p>
				</div>
				<p>ETH</p>
			</button>
			<button
				on:click={() => handleClick('USDC')}
				class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
			>
				<div class="flex items-center gap-2">
					<img src="/external/usdc.png" alt="eth" class="h-8 w-8" />
					<p>USDC</p>
				</div>
				<p>USDC</p>
			</button>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>

<Dialog.Root bind:open={openWithdraw}>
	<Dialog.FlyInContent class="bg-popover">
		<div class="flex w-full flex-col gap-3">
			<p class="font-3xl font-extrabold text-center">Withdraw</p>

			<!-- Wallet balance and 'credit card' -->
			<Card
				class="p-6 text-popover bg-[url('/backgrounds/card-dashboard-eth.png')] rounded-3xl flex flex-col"
			>
				<div class="w-full flex justify-between">
					<div class=" rounded-xl">
						<p class="font-extrabold text-lg">{currency}</p>
						<p class="text-sm font-extralight text-muted-foreground">Your Ambos Wallet</p>
					</div>
					<div class="flex flex-col items-end justify-between">
						<div class="h-10 w-10 bg-popover flex items-center justify-center rounded-full">
							<img src={`/external/${currency.toLowerCase()}.png`} alt="eth" class="h-8 w-8" />
						</div>
					</div>
				</div>
				<div class="w-full flex justify-between items-center">
					{#if currency === 'ETH'}
						<p class="text-2xl">{e(ethBalance)} ETH</p>
					{:else}
						<p class="text-2xl">{e(usdcBalance)} USDC</p>
					{/if}
				</div>
			</Card>

			<!-- Select how much -->
			<InputEditSlider
				title={`How much ${currency} do you want to witdraw?`}
				max={currency === 'ETH' ? ethBalance : usdcBalance}
				step={0.01}
				showRange={true}
				bind:value={withdrawQty}
				{formatter}
			/>

			<!-- Network -->
			<Card class="flex justify-between px-3 py-2 text-sm shadow-none">
				<div class="flex items-center">
					<div class="h-8 w-8 bg-popover flex items-center justify-center rounded-full">
						<NetworkLogos class="h-5 w-5" />
					</div>
					<NetworkNames class="pl-2 font-bold" />
				</div>
				<div class="flex items-center justify-end gap-2">
					<p>ETH</p>
					<TooltipIcon text={TOOLTIPS.NETWORK} />
				</div>
			</Card>

			<!-- Send to -->
			<div class="flex flex-col w-full gap-2 mt-1">
				<p class="font-bold">Send to</p>
				<div
					class="border-muted-foreground border-2 rounded-xl p-2 flex items-center justify-between gap-2"
				>
					<input type="text" class="grow focus:border-0" bind:value={sendAddress} />
					<ScanLineIcon class="h-5 w-5" />
				</div>
				<Card class="flex justify-between px-3 py-2 text-sm shadow-none">
					<div class="flex items-center justify-end gap-2">
						<p class="font-bold">Transaction Fee</p>
						<TooltipIcon text={TOOLTIPS.TRANSACTION_FEE} />
					</div>
					<div class="flex items-center gap-2">
						<p>{e(0.00012)}</p>
						<p>{f(10)}</p>
					</div>
				</Card>
			</div>

			<!-- Network Caution -->
			<Card
				class="flex flex-col gap-3 items-center justify-between px-3 py-2 text-sm text-center shadow-none"
			>
				<p class="w-full font-bold text-destructive">Network Caution!</p>
				<p class="w-full">
					Ensure you send to the correct network to avoid irreversible loss of funds!
				</p>
				<div class="flex items-center space-x-2 pb-2">
					<Label
						for="terms"
						class="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						I acknowledge the network details.
					</Label>
					<Checkbox id="terms" bind:checked />
				</div>
			</Card>
			<Button disabled={!checked} class="w-full" on:click={handleWithdraw}>Withdraw</Button>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
