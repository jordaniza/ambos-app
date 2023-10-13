<script lang="ts">
	import Base from '$lib/components/charts/base.svelte';
	import { onMount } from 'svelte';
	export let resize: () => void;
	export let height: number = 50;

	export let data: { x: number; y: number }[] = [];

	// Common Options
	$: sparklineOptions = {
		chart: {
			type: 'line',
			sparkline: {
				enabled: true
			},
			height
		},
		tooltip: {
			enabled: false
		},
		stroke: {
			width: 1,
			curve: 'smooth',
			colors: ['hsl(131 42% 49%)']
		},
		series: [
			{
				data
			}
		]
	} as ApexCharts.ApexOptions;
</script>

{#if data && data.length === 0}
	<div class="h-10 flex-grow flex items-center justify-center">Loading...</div>
{:else if data && data.length > 0}
	<div class="h-10 flex-grow flex items-center justify-center">
		<Base bind:resize options={sparklineOptions} />
	</div>
{/if}
