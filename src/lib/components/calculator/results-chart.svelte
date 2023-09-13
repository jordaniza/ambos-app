<script lang="ts">
	import { f } from '$lib/utils';
	import { onMount } from 'svelte';

	export let borrowed = 10;
	export let ethRemaining = 18;
	export let ethIfYouSold = 13;

	let isMobile = window.innerWidth < 640; // Initial value
	let loaded = false;
	let ApexCharts: any;

	// Common Options
	const commonOptions = {
		chart: {
			type: 'bar',
			toolbar: { show: false }
		},
		legend: { show: false },
		tooltip: { enabled: false },
		dataLabels: {
			enabled: true,
			formatter: function (val) {
				return f(val);
			}
		}
	};

	// Derived Options
	const mobileOptions = {
		...commonOptions,
		plotOptions: { bar: { horizontal: true } },
		yaxis: { show: true, labels: { style: { colors: ['white', 'white', 'white'] } } },
		xaxis: { labels: { show: false } }
	};

	const desktopOptions = {
		...commonOptions,
		plotOptions: { bar: { horizontal: false } },
		yaxis: { show: false },
		xaxis: {
			labels: {
				show: true,
				style: { colors: ['white', 'white', 'white'] }
			}
		}
	};

	// Series computation
	$: seriesFull = [
		{
			data: [
				{ x: 'Borrowed', y: borrowed },
				{ x: 'ETH Remaining', y: ethRemaining },
				{ x: 'ETH Remaining if you sold', y: ethIfYouSold }
			]
		}
	];

	$: seriesPart = [
		{
			data: [
				{ x: 'Borrowed', y: borrowed },
				{ x: 'ETH Remaining if you sold', y: ethIfYouSold }
			]
		}
	];

	$: currentSeries = ethRemaining > 0 ? seriesFull : seriesPart;
	$: mobileOptions.series = currentSeries;
	$: desktopOptions.series = currentSeries;

	const handleResize = () => {
		isMobile = window.innerWidth < 640;
	};

	onMount(() => {
		window.addEventListener('resize', handleResize);

		return () => {
			// Cleanup listener on component destroy
			window.removeEventListener('resize', handleResize);
		};
	});

	onMount(async () => {
		const module = await import('apexcharts');
		ApexCharts = module.default;
		loaded = true;
	});

	const chart = (node, options) => {
		if (!loaded) return;

		let myChart = new ApexCharts(node, isMobile ? mobileOptions : desktopOptions);
		myChart.render();

		return {
			update() {
				myChart.updateOptions(isMobile ? mobileOptions : desktopOptions);
			},
			destroy() {
				myChart.destroy();
			}
		};
	};
</script>

{#if loaded}
	<div use:chart={isMobile ? mobileOptions : desktopOptions} />
{/if}
