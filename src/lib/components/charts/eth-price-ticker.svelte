<script lang="ts">
	import { getChangeInEthPrice } from '$lib/cache';

	import { pc } from '$lib/utils';
	import { onMount } from 'svelte';

	let ethPriceDelta = 0;
	$: priceUp = ethPriceDelta > 0;

	onMount(async () => {
		ethPriceDelta = await getChangeInEthPrice();
	});
</script>

<p class={priceUp ? 'text-primary' : 'text-destructive'}>
	{priceUp ? '↑+' : '↓-'}{pc(ethPriceDelta)}
</p>
