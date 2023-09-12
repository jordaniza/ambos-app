<script lang="ts">
	import { f } from '$lib/utils';
	import { onMount } from 'svelte';

	export let borrowed = 10;
	export let ethRemaining = 18;
	export let ethIfYouSold = 13;

	const options = {
		chart: {
			type: 'bar'
		},
		toolbar: {
			show: false
		},
		legend: {
			show: false
		},
		tooltip: {
			enabled: false
		},
		plotOptions: {
			bar: {
				horizontal: false
			}
		},
		yaxis: {
			show: false
		},
		xaxis: {
			labels: {
				style: { colors: ['white', 'white', 'white', 'white'] }
			}
		},
		dataLabels: {
			enabled: true,
			formatter: function (val) {
				return f(val);
			}
		},
		series: []
	};

	$: series = [
		{
			data: [
				{
					x: 'Borrowed',
					y: borrowed
				},
				{
					x: 'ETH Remaining',
					y: ethRemaining
				},
				{
					x: 'After Repayment',
					y: ethRemaining - borrowed
				},
				{
					x: 'ETH Remaining if you sold',
					y: ethIfYouSold
				}
			]
		}
	];

	$: options.series = series;

	let ApexCharts: any;
	let loaded = false;

	const chart = (node, options) => {
		if (!loaded) return;

		let myChart = new ApexCharts(node, options);
		myChart.render();

		return {
			update(options) {
				myChart.updateOptions(options);
			},
			destroy() {
				myChart.destroy();
			}
		};
	};

	onMount(async () => {
		const module = await import('apexcharts');
		ApexCharts = module.default;
		// @ts-ignore
		window.ApexCharts = ApexCharts;
		loaded = true;
	});
</script>

{#if loaded}
	<div class="text-white" use:chart={options} />
{/if}
