<script lang="ts">
	import { onMount } from 'svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import Calculator from './calculator.svelte';
	import { BACKGROUNDS } from '$lib/constants';
	import TopBar from '../dashboard-v2/top-bar.svelte';

	let ethSupply = 10; // Initial value
	let borrowAmount = 0; // Initial value
	let ethPrice = 0; // Initial or fetched value
	let fetchedAt: Date;
	let newEthPrice = 0;
	let ethPriceChange = 20; // Initial value
	let depositValue = ethSupply / 2;

	// Computed values
	$: newEthPrice = ethPrice * (1 + ethPriceChange / 100);
	$: depositUSD = depositValue * ethPrice;
	$: maxBorrow = depositUSD / 2;

	$: {
		if (borrowAmount > maxBorrow) {
			borrowAmount = maxBorrow;
		}
	}

	// More logic here$lib.
	async function fetchEthPrice() {
		try {
			const response = await fetch(
				'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
			);
			const data = await response.json();
			ethPrice = data.ethereum.usd;
			fetchedAt = new Date();
			setTimeout(() => (borrowAmount = maxBorrow * 0.5), 0);
		} catch (error) {
			console.error(error);
		}
	}

	onMount(fetchEthPrice);
</script>

<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/calculator.png')]"
	/>
	<div slot="header" class="pb-20">
		<TopBar
			page="Ambos Loans Calculator"
			subtitle="Start discovering how much you can borrow against your ETH."
		/>
	</div>
	<div slot="card" class=" transform -translate-y-20">
		<Calculator />
	</div>
</BaseScreen>
