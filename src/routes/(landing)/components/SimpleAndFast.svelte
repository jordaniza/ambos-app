<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	const features = [
		{
			idx: 1,
			title: 'Simple login',
			description:
				'No private keys required - use your Google account or a simple email & password login.'
		},
		{
			idx: 2,
			title: 'Secured with 2FA',
			description: 'Two-factor authentication gives you extra security against attackers.'
		},
		{
			idx: 3,
			title: 'Streamlined',
			description:
				'Borrow in just a few clicks, then buy and sell directly within our application or send to any other address you like.'
		}
	];
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

		<div class="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:text-center">
			{#each features as feature}
				<Card class="p-3 flex flex-col h-full justify-between">
					<CardTitle class="my-3 md:text-2xl">
						<h1>{feature.title}</h1>
					</CardTitle>
					<CardContent>
						<p class="md:text-xl">{feature.description}</p>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>
