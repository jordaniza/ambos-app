<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Workflow, Waves, Key } from 'lucide-svelte';
	const features = [
		{
			idx: 1,
			title: 'Simple',
			description:
				'No private keys required - use your Google account or a simple email & password login.'
		},
		{
			idx: 2,
			title: 'Streamlined',
			description:
				'Borrow in just a few clicks, then buy and sell directly within our application or send to any other address you like.'
		},
		{
			idx: 3,
			title: 'Secured',
			description: 'Two-factor authentication gives you extra security against attackers.'
		}
	];
	const size = 50;
</script>

<section class="bg-white py-10">
	<div class="container mx-auto flex flex-wrap pt-4 pb-12">
		<h1 class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
			Simple and Fast
		</h1>
		<p class="text-gray-800 text-lg md:text-2xl text-center my-4 md:my-8 w-full">
			Until now, Decentralised Finance (DeFi) has been too complicated for anyone not deeply
			involved in the space to use.
			<br />
			<br />
			<span class="font-bold">We want to change that.</span>
			<br />
			<br />
			We stripped out all the hassle and complexity of crypto to make borrowing as easy as possible.
		</p>
		<div class="w-full mb-4">
			<div class="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
		</div>

		<div class="grid grid-cols-1 gap-3 lg:grid-cols-3 text-center">
			{#each features as feature}
				<Card
					class="flex gap-y-4 items-center rounded-xl shadow-md relative isolate md:-ml-8 lg:ml-0"
				>
					<div class="flex flex-shrink-0 mr-5 items-center justify-center p-3 relative left-6">
						{#if feature.idx === 1}
							<Workflow {size} />
						{/if}
						{#if feature.idx === 2}
							<Waves {size} />
						{/if}
						{#if feature.idx === 3}
							<Key {size} />
						{/if}
					</div>
					<div class="relative w-full pl-8 pr-4 py-3 bg-bottom bg-no-repeat rounded-lg text-left">
						<h3 class="text-xl md:text-2xl font-bold text-secondary">
							{feature.title}
						</h3>
						<p class="my-3 md:text-xl">{feature.description}</p>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</section>
