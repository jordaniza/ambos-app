<script lang="ts">
	import { onMount } from 'svelte';
	let loaded = false;
	let ApexCharts: typeof import('apexcharts');
	let chartRef: Node;

	// destroy and re-render chart
	export const resize = () => {
		if (!chartRef || !mobileOptions || !chart || !loaded) return;
		const myChart = chart(chartRef, mobileOptions)!;
		myChart.destroy();
		// event loop hack to ensure chart is destroyed before re-rendering
		setTimeout(() => {
			myChart.chart(chartRef, mobileOptions);
		}, 0);
	};

	// Common Options
	const commonOptions: ApexCharts.ApexOptions = {
		chart: {
			type: 'line',
			sparkline: {
				enabled: true
			}
		},
		tooltip: {
			enabled: false
		},
		stroke: {
			width: 1,
			curve: 'smooth',
			colors: ['hsl(131 42% 49%)']
		}
	};
	// Derived Options
	const mobileOptions: ApexCharts.ApexOptions = {
		...commonOptions
	};

	let data = Array(6)
		.fill(0)
		.map((_, i) => ({ x: i, y: Math.random() * 100 }));
	// Series computation
	$: seriesFull = [
		{
			data
		}
	];

	$: mobileOptions.series = seriesFull;

	onMount(async () => {
		const module = await import('apexcharts');
		ApexCharts = module.default;
		loaded = true;
	});

	const chart = (node: Node, _: ApexCharts.ApexOptions) => {
		if (!loaded) return;

		let myChart = new ApexCharts(node, mobileOptions);
		myChart.render();

		return {
			chart,
			self() {
				return myChart;
			},
			update() {
				myChart.updateOptions(mobileOptions);
			},
			destroy() {
				myChart.destroy();
			}
		};
	};
</script>

{#if loaded}
	<div bind:this={chartRef} class="w-full h-full" use:chart={mobileOptions} />
{/if}
