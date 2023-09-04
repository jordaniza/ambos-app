<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';

	const styles = {
		xs: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-2',
		sm: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-5xl lg:px-12',
		md: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-5xl lg:px-8',
		lg: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-7xl lg:px-8',
		xl: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-screen-2xl',
		wide: 'mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-[calc(1536px-2rem)]'
	};

	const yieldFeatures = [
		{
			title: 'Deposit ETH',
			description: 'Deposit ETH using our simple, streamlined, non-custodial platform',
			icon: 1,
			background: 'pink-500'
		},
		{
			title: 'Borrow USD',
			description:
				'Borrow up to 50% of the value of that ETH, in stablecoins or a fiat currency of your choice',
			icon: 2,
			background: 'blue-500'
		},
		{
			title: 'Repay When You Want',
			description:
				'Later, simply pay off your loan at any time, and you keep the full value of your investments.',
			icon: 3,
			background: 'red-200'
		}
	];
</script>

<section
	class="flex flex-col mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-screen-2xl my-10 py-10"
>
	<h2 class="text-center text-4xl font-bold mt-2 mb-4">How It Works</h2>
	<div class="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 lg:grid-cols-3 lg:text-center">
		{#each yieldFeatures as feature, index}
			<Card class="flex gap-y-4 relative isolate md:-ml-8 lg:ml-0">
				<div
					class="flex flex-shrink-0 text-6xl mr-5 items-center justify-center bg-background shadow-md relative z-10 left-6 -top-2"
				>
					{feature.icon}
				</div>
				<div class="relative w-full pl-8 pr-4 py-3 bg-bottom bg-no-repeat rounded-lg text-left">
					<h3 class="text-xl font-bold text-primary">
						{feature.title}
					</h3>
					<p class="my-3">{feature.description}</p>
				</div>
			</Card>
		{/each}
	</div>
</section>
