<script lang="ts">
	import Sparkline from '$lib/components/charts/sparkline.svelte';
	import { LOCAL_STORAGE_KEYS } from '$lib/constants';
	import { onMount } from 'svelte';

	type APIResponse = {
		prices: [number, number][];
	};

	const API_ENDPOINT =
		'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=14&interval=daily&precision=2';
	let data: { x: number; y: number }[] = [];
	let resize: () => void;

	onMount(async () => {
		// Try to load cached data
		const cachedData = localStorage.getItem(LOCAL_STORAGE_KEYS.CACHED_CHART_DATA);
		if (cachedData) {
			const parsedData = JSON.parse(cachedData);
			const isDataFresh = Date.now() - parsedData.timestamp < 3600000; // Data is fresh for 1 hour

			if (isDataFresh) {
				data = parsedData.data;
				return; // Use cached data and do not fetch new data
			}
		}

		try {
			// Fetch the data from the API
			const res = await fetch(API_ENDPOINT);
			const json = (await res.json()) as APIResponse;
			data = json.prices.map(([_, y], i) => ({ x: i, y }));

			// Cache the data along with the current timestamp
			localStorage.setItem(
				LOCAL_STORAGE_KEYS.CACHED_CHART_DATA,
				JSON.stringify({ data, timestamp: Date.now() })
			);
		} catch (e) {
			console.error(e);
		}
	});
</script>

<Sparkline bind:resize height={30} {data} />
