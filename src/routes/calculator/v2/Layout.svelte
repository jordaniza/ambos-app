<script lang="ts">
	import Stepper from '$lib/components/ui/stepper/stepper.svelte';
	import { ROUTES } from '$lib/constants';

	const links = [
		{
			name: 'twitter',
			icon: 'twitter',
			href: 'https://x.com/ambosfinance'
		},
		{
			name: 'discord',
			icon: 'discord',
			href: 'https://discord.gg/xhYkFyDU6y'
		},
		{
			name: 'linkedin',
			icon: 'linkedin',
			href: 'https://www.linkedin.com/company/ambos-finance'
		},
		{
			name: 'website',
			icon: 'site',
			href: 'https://ambos.finance?utm_source=calculator'
		}
	];

	const steps = [
		{
			route: ROUTES.CALCULATOR_V2_START,
			name: 'ETH Deposit'
		},
		{
			route: ROUTES.CALCULATOR_V2_BORROW,
			name: 'USD Borrow'
		},
		{
			route: ROUTES.CALCULATOR_V2_SIMULATE,
			name: 'Simulate Results'
		}
	];
</script>

<div class="flex flex-col items-center w-full justify-center text-base p-5 md:p-0">
	<div class=" grow w-full flex items-center justify-center">
		<img src="/ambos-header.png" alt="ambos logo" class="h-16 my-5" />
	</div>
	<div class="max-w-4xl grow">
		<slot name="banner" />
		<div class="pt-2 pb-5">
			<Stepper {steps} />
		</div>
		<slot />
	</div>
	<footer class="w-full flex flex-col items-center justify-center gap-3 py-3 max-w-4xl">
		<div class="flex justify-center w-full text-center px-4 py-3">
			<div class="p-4 flex flex-col gap-2 w-full">
				<p class="text-xl font-extrabold">DISCLAMER</p>

				<p class="text-muted-foreground">
					This calculator is for illustrative purposes only. It is not intended to be a substitute
					for professional financial advice. While every attempt has been made to ensure that the
					calculations presented here are representative, Ambos Finance does not guarantee the
					accuracy of the calculations or their applicability to your circumstances. <br />As
					always, do your own research: taking out a loan in any circumstance involves risk, and,
					especially in DeFi, it's important to understand these risks.
				</p>
			</div>
		</div>
		<div class="flex gap-3 w-full justify-center">
			{#each links as link}
				<a href={link.href} target="_blank">
					<img src={`/external/${link.icon}.png`} alt={link.name} class="h-6 w-6" />
				</a>
			{/each}
		</div>
	</footer>
</div>
