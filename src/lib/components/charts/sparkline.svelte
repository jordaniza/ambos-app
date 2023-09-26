<script lang="ts">
	import Base from '$lib/components/charts/base.svelte';
	export let resize: () => void;
	export let height: number = 50;

	// random data
	let data = Array(6)
		.fill(0)
		.map((_, i) => ({ x: i, y: Math.random() * 100 }));

	// Common Options
	const sparklineOptions: ApexCharts.ApexOptions = {
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
	};
</script>

<div class="h-10 flex-grow flex items-center justify-center">
	<Base bind:resize options={sparklineOptions} />
</div>
