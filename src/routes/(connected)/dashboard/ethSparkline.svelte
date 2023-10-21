<script lang="ts">
	import { getChangeInEthPrice, getEthPriceData } from '$lib/cache';
	import Sparkline from '$lib/components/charts/sparkline.svelte';
	import { onMount } from 'svelte';

	let data: { x: number; y: number }[] = [];
	let resize: () => void;

	async function tryQuoteFromCache() {
		try {
			data = await getEthPriceData();
		} catch (e) {
			console.error('Error fetching chart data', e);
		}
	}

	onMount(tryQuoteFromCache);
</script>

<Sparkline bind:resize height={30} {data} />
