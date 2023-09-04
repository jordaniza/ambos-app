<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import { Clock, Lock, CircleDollarSign, Check } from 'lucide-svelte';

	const features = [
		{
			idx: 0,
			headline: 'No time limits',
			description: 'Pay off the loan when you want to: there are no time limits to repay.'
		},
		{
			idx: 1,
			headline: 'Provably secure',
			description:
				'Ambos is powered by some of the most robust lending platforms in the decentralised finance space - with over $6 Billion of assets secured.'
		},
		{
			idx: 2,
			headline: 'Your Money is yours',
			description:
				'Ambos never holds your money and never has access to it. If we disappear tomorrow, your money is still safe and still accessible by you.'
		},
		{
			idx: 3,
			headline: 'No debt collectors',
			description:
				'Ambos will never call you to demand your money back. By depositing more ETH than you borrow, you are fully covered even if the value of your ETH declines.'
		}
	];
	const size = '50';
</script>

<section class="bg-white py-8">
	<div class="container max-w-8xl mx-auto my-20">
		<h1 class="w-full my-10 text-5xl font-bold leading-tight text-center text-gray-800">
			Loans that You Control
		</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-10">
			<div class="p-5 h-full flex flex-col items-center justify-center">
				<img src="features/MoneyOut.svg" alt="Your Money, Your Control" />
			</div>
			<div class="w-full flex flex-col justify-evenly gap-5">
				{#each features as feature}
					<Card
						class="flex gap-y-4 rounded-xl shadow-md relative isolate bg-transparent border-none text-secondary md:-ml-8 lg:ml-0"
					>
						<div class="flex flex-shrink-0 mr-5 items-center justify-center p-3 relative left-6">
							{#if feature.idx === 0}
								<Clock {size} />
							{/if}
							{#if feature.idx === 1}
								<Lock {size} />
							{/if}
							{#if feature.idx === 2}
								<CircleDollarSign {size} />
							{/if}
							{#if feature.idx === 3}
								<Check {size} />
							{/if}
						</div>
						<div class="relative w-full pl-8 pr-4 py-3 bg-bottom bg-no-repeat rounded-lg text-left">
							<h3 class="text-xl md:text-2xl font-bold text-primary">
								{feature.headline}
							</h3>
							<p class="my-3 md:text-xl">{feature.description}</p>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	</div>
</section>
