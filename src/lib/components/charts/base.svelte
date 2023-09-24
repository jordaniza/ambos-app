<script lang="ts">
	import { onMount } from 'svelte';
	let loaded = false;
	let ApexCharts: typeof import('apexcharts');
	let chartRef: Node;

	export let options: ApexCharts.ApexOptions = {};
	// destroy and re-render chart
	export const resize = () => {
		if (!chartRef || !options || !chart || !loaded) return;
		const myChart = chart(chartRef, options)!;
		myChart.destroy();
		// event loop hack to ensure chart is destroyed before re-rendering
		setTimeout(() => {
			myChart.chart(chartRef, options);
		}, 0);
	};

	// Series computation
	onMount(async () => {
		const module = await import('apexcharts');
		ApexCharts = module.default;
		loaded = true;
	});

	const chart = (node: Node, _: ApexCharts.ApexOptions) => {
		if (!loaded) return;

		let myChart = new ApexCharts(node, options);
		myChart.render();

		return {
			chart,
			self() {
				return myChart;
			},
			update() {
				myChart.updateOptions(options);
			},
			destroy() {
				myChart.destroy();
			}
		};
	};
</script>

{#if loaded}
	<div bind:this={chartRef} class="w-full h-full" use:chart={options} />
{/if}
