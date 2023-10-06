<script lang="ts">
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import LoanStepper from '$lib/components/ui/stepper/loanStepper.svelte';
	import Calculator from '../../calculator/calculator.svelte';
	import { ROUTES } from '$lib/constants';

	let ethSupply = 10; // Initial value
	let borrowAmount = 0; // Initial value
	let ethPrice = 0; // Initial or fetched value
	let newEthPrice = 0;
	let ethPriceChange = 20; // Initial value
	let depositValue = ethSupply / 2;

	$: newEthPrice = ethPrice * (1 + ethPriceChange / 100);
	$: depositUSD = depositValue * ethPrice;
	$: maxBorrow = depositUSD / 2;
	$: {
		if (borrowAmount > maxBorrow) {
			borrowAmount = maxBorrow;
		}
	}
</script>

<!-- <Faq /> -->
<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans.png')]"
	/>
	<div slot="header" class="pb-5">
		<BackButton backTo={ROUTES.DASHBOARD_V2} />
		<div class="pt-5 px-4">
			<h1 class="font-extrabold text-2xl pb-3 tracking-widest">Ambos Loans Calculator</h1>
			<p>Start discovering how much you can borrow against your Ethereum.</p>
		</div>
	</div>
	<div slot="card" class="flex flex-col">
		<div class="p-4">
			<LoanStepper />
		</div>
		<Calculator />
	</div>
</BaseScreen>
