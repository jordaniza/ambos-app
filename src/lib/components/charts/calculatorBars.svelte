<script lang="ts">
	import Base from '$lib/components/charts/base.svelte';
	export let resize: () => void = () => {};
	export let borrowed = 10;
	export let ethRemaining = 1000;
	export let ethIfYouSold = 13;
	export let liquidated = false;

	const options: ApexCharts.ApexOptions = {
		chart: {
			type: 'bar',
			toolbar: { show: false },

			height: '100%'
		},
		legend: { show: false },
		tooltip: { enabled: false },
		dataLabels: {
			enabled: false
		},
		plotOptions: {
			bar: {
				distributed: true,
				horizontal: false,
				columnWidth: '20%'
			}
		},
		colors: ['hsl(219 97% 61%)', 'hsl(131 42% 49%)', 'hsl(0 84.2% 60.2%)'],
		yaxis: {
			show: true,
			labels: {
				formatter: function (val: number) {
					return new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0
					}).format(val);
				}
			}
		},
		xaxis: {
			labels: {
				show: true,
				rotate: 0,
				style: {
					colors: ['black', 'black', 'black'],
					fontSize: '10px'
				}
			}
		}
	};

	// Series computation
	$: seriesFull = [
		{
			data: [
				{ x: 'Borrowed', y: borrowed },
				{ x: 'ETH Remaining', y: ethRemaining },
				{ x: 'ETH if sold', y: ethIfYouSold }
			]
		}
	];

	$: seriesPart = [
		{
			data: [
				{ x: 'Borrowed', y: borrowed },
				{ x: 'ETH if sold', y: ethIfYouSold }
			]
		}
	];

	$: currentSeries = !liquidated ? seriesFull : seriesPart;
	$: options.series = currentSeries;
</script>

<Base bind:resize {options} />
