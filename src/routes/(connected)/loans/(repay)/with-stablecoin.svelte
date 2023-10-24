<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { USDC, e, f } from '$lib/utils';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { decreaseDebt } from '$stores/transactions/batchActions';
	import { makeTxId } from '$stores/transactions/state';
	import { getTxStore } from '$lib/context/getStores';

	export let open = false;

	let openLoading = false;
	let usdcBalance = 10000;
	let repayQty = 0;
	let checked: boolean = false;
	let txStore = getTxStore();

	function formatter() {
		return `${e(repayQty)} USDC`;
	}

	function handleClick() {
		const id = makeTxId();
		decreaseDebt({
			store: txStore,
			repayAmountinUSDC: USDC(repayQty),
			id
		});
		open = false;
		openLoading = true;
	}
</script>

<!-- Repay from Wallet -->
<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Repay With USDC</Dialog.Title>

		<div class="flex flex-col gap-5 text-sm">
			<div class="flex flex-col text-base gap-2">
				<div class="flex justify-between">
					<p>Outstanding Amount:</p>
					<p class="text-secondary">{f(1000)}</p>
				</div>
				<div class="flex justify-between">
					<p>Interest:</p>
					<p class="text-secondary">{f(500)}</p>
				</div>
			</div>
			<!-- Wallet balance and 'credit card' -->
			<Card
				class="p-6 text-popover bg-[url('/backgrounds/card-dashboard-stable.png')] bg-cover rounded-3xl flex flex-col"
			>
				<div class="w-full flex justify-between">
					<div class=" rounded-xl">
						<p class="font-extrabold text-lg">USDC</p>
						<p class="text-sm font-extralight text-muted">Your Ambos Wallet</p>
					</div>
					<div class="flex flex-col items-end justify-between">
						<div class="h-10 w-10 bg-popover flex items-center justify-center rounded-full">
							<img src={`/external/usdc.png`} alt={'usdc'} class="h-8 w-8" />
						</div>
					</div>
				</div>
				<div class="w-full flex justify-between items-center">
					<p class="text-2xl">{e(usdcBalance)} USDC</p>
				</div>
			</Card>

			<InputEditSlider
				showRange={true}
				max={usdcBalance}
				title="How much USDC do you want to use to repay the loan?"
				step={0.01}
				bind:value={repayQty}
				{formatter}
			/>

			<div class="rounded-2xl px-4 py-2 bg-background flex justify-between">
				<div class="flex gap-2">
					<p>Gas Fee</p>
					<TooltipIcon text={TOOLTIPS.GAS_FEES} />
				</div>
				<div class="flex gap-2">
					<p>{e(0.001)} ETH</p>
					<p>{f(0.2)}</p>
				</div>
			</div>
			<div class="flex gap-2 items-center justify-center">
				<button on:click={() => (checked = !checked)} class="text-xs font-bold"
					>I have reviewed and confirm that I want to repay the loan.</button
				>
				<Checkbox bind:checked />
			</div>
			<Button disabled={!checked || repayQty === 0} on:click={handleClick}>Repay Loan</Button>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
