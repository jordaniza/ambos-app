<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ROUTES } from '$lib/constants';
	import { cn, f } from '$lib/utils';
  import { web3Store } from '$stores/web3';

  $: owedUSD =  $web3Store.userPoolData?.totalDebtBase.small ?? 0;
  $: collateralValueUSD = $web3Store.userPoolData?.totalCollateralBase.small ?? 0;
  $: variableRateIR = $web3Store.poolReserveData?.variableBorrowingRate.small ?? 0; 

</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle class="mb-5 md:text-2xl">Loans Overview</CardTitle>
		<CardDescription class="md:text-xl">
			A summary of your current outstanding loan balances.
		</CardDescription>
	</CardHeader>
	<section class="grid grid-cols-2 gap-0">
		<CardContent class="grid grid-cols-1 gap-4">
			<div class="flex flex-col">
				<p class="text-sm md:text-xl font-medium leading-none">Owed</p>
				<p class="text-xl md:text-xl font-bold">{f(owedUSD)}</p>
			</div>
			<div class="flex flex-col">
				<p class="text-sm md:text-xl font-medium leading-none">Supplied</p>
				<p class="text-xl md:text-xl font-bold">{f(collateralValueUSD)}</p>
			</div>
			<div class="flex flex-col">
				<p class="text-sm md:text-xl font-medium leading-none">Interest Rate</p>
				<p class="text-xl md:text-xl font-bold">{variableRateIR.toFixed(3)}%</p>
			</div>
		</CardContent>
		<div class="ml-10 mt-6" />
	</section>
	<Separator class="mb-5" />
	<CardFooter>
		<Button class="w-full md:py-7">
			<a class="w-full md:text-xl md:py-3" href={ROUTES.MY_LOANS}>Manage Loans</a>
		</Button>
	</CardFooter>
</Card>
