<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ROUTES } from '$lib/constants';
	import { cn } from '$lib/utils';

	let owed = 0;
	let collateralValueUSD = 0;
	let variableRateIR = 0;
</script>

<Card class={cn('w-full')}>
	<CardHeader>
		<CardTitle class="mb-5">Loans Overview</CardTitle>
		<CardDescription>A summary of your current outstanding loan balances.</CardDescription>
	</CardHeader>
	<section class="grid grid-cols-2 gap-0">
		<CardContent class="grid grid-cols-1 gap-4">
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">Owed</p>
				<p class="text-xl font-bold">{owed}</p>
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">Supplied</p>
				<p class="text-xl font-bold">{collateralValueUSD}</p>
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">Interest Rate</p>
				<p class="text-xl font-bold">{variableRateIR}%</p>
			</div>
		</CardContent>
		<div class="ml-10 mt-6" />
	</section>
	<Separator class="mb-5" />
	<CardFooter>
		<Button class="w-full">
			<a class="w-full" href={ROUTES.MY_LOANS}>Manage Loans</a>
		</Button>
	</CardFooter>
</Card>
