<script lang="ts">
	import Eth from '$lib/eth.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import LoanStepper from '$lib/components/ui/stepper/loanStepper.svelte';
	import { ROUTES } from '$lib/constants';
	import { f } from '$lib/utils';
	import InputEditSlider from './input-edit-slider.svelte';
	import { InfoIcon } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let ethSupply = 10;
	let depositValue = ethSupply / 2;
	let ethPrice = 1600;
	let maxBorrow = (depositValue * ethPrice) / 2;
	let borrowAmount = maxBorrow / 2;

	$: notEnoughETH = depositValue > ethSupply * (3 / 4);

	function formatETHValue(value: number): string {
		return `${value} ETH - ${f(value * ethPrice)}`;
	}

	function formatBorrowValue(value: number): string {
		return `${f(value)} of ${f(maxBorrow)}`;
	}
</script>

<BaseScreen>
	<div slot="header" class="pb-5">
		<BackButton backTo={ROUTES.DASHBOARD_V2} />
		<div class="pt-5 px-4">
			<h1 class="font-extrabold text-2xl pb-3 tracking-widest">Review Your Loan Details</h1>
			<p>Check all the details and get your loan now</p>
		</div>
	</div>
	<div slot="card" class="p-4 flex flex-col gap-5 pb-20">
		<LoanStepper />
		<!-- Review Params -->
		<Card class="bg-popover px-4 py-4 flex flex-col gap-4">
			<Card class="bg-background rounded-xl py-2 px-4 flex flex-col gap-2">
				<div class="w-full flex justify-between items-center">
					<div class=" rounded-xl">
						<p class="font-extrabold">ETH</p>
						<p class="text-sm text-secondary">Your Ambos Wallet</p>
						<p class="text-xl">0.152 ETH</p>
					</div>
					<div class="flex flex-col items-end justify-between">
						<div class="h-10 w-10 bg-popover p-2 rounded-lg">
							<Eth />
						</div>
					</div>
				</div>
			</Card>
			<InputEditSlider
				title="You Supply"
				bind:value={depositValue}
				max={ethSupply}
				step={0.01}
				formatter={formatETHValue}
			/>
			<InputEditSlider
				title="Borrowing"
				bind:value={borrowAmount}
				max={maxBorrow}
				step={1}
				formatter={formatBorrowValue}
			/>
			<div
				class="bg-background text-xs py-2 rounded-2xl px-4 flex w-full justify-between items-center"
			>
				<p class="font-bold">Liquidation Price</p>
				<div class="flex gap-2 justify-end items-center">
					<p>{f(923)} / ETH</p>
					<InfoIcon class="h-4 text-muted-foreground" />
				</div>
			</div>
			<div
				class="bg-background text-xs py-2 rounded-2xl px-4 flex w-full justify-between items-center"
			>
				<p class="font-bold">Est. Fees & Charges</p>
				<div class="flex gap-2 justify-end items-center">
					<p>{f(923)} <span class="text-muted-foreground pl-1">{(16.38).toFixed(2)}%</span></p>
					<InfoIcon class="h-4 text-muted-foreground" />
				</div>
			</div>
			{#if notEnoughETH}<p class="text-destructive w-full text-center">Not enough ETH</p>{/if}
			<Button variant={notEnoughETH ? 'secondary' : 'default'} class="w-full py-5"
				>{notEnoughETH ? 'Transfer More' : 'Confirm & Get Loan'}</Button
			>
			<Button variant="link">Repayment Terms</Button>
		</Card>
	</div>
</BaseScreen>
