<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { cn, f } from '$lib/utils';
	import { ROUTES } from '$lib/constants';
	import { getWeb3Store } from '$lib/context/getStores';

	const web3Store = getWeb3Store();

	$: owed = $web3Store.userPoolData?.totalDebtBase.small ?? 0;
	$: availableToBorrow = $web3Store.userPoolData?.availableBorrowBase.small ?? 0;
	$: variableRateIR = $web3Store.poolReserveData?.variableBorrowingRate.small ?? 0;
</script>

<Card class={cn('w-full')}>
	<CardHeader>
		<CardTitle>
			<h1 class="md:text-2xl">Loans</h1>
		</CardTitle>
		<CardDescription>
			<p class="md:text-xl">
				This is the total amount you need to repay in USDC to unlock and reclaim your ETH. It is the
				original amount in USD, plus accumulated interest.
			</p>
		</CardDescription>
	</CardHeader>
	<CardContent>
		<ul class="list-disc list-inside">
			<li class="flex justify-between">
				<div class="md:text-xl">Total Borrowed</div>
				<div class="md:text-xl">{f(owed)}</div>
			</li>
			<li class="flex justify-between md:my-5">
				<div class="md:text-xl">Available To Borrow</div>
				<div class="md:text-xl">{f(availableToBorrow)}</div>
			</li>
			<li class="flex justify-between">
				<div class="md:text-xl">Interest Rate</div>
				<div class="md:text-xl">{variableRateIR.toFixed(2)}%</div>
			</li>
		</ul>
	</CardContent>
	<Separator class=" mb-5" />
	<CardFooter>
		<Button disabled class="w-1/2 mr-1 md:text-xl">Repay (Soon)</Button>
		<Button class="w-1/2 ml-1 md:text-xl" variant="secondary">
			<a href={ROUTES.NEW_LOAN}> Borrow More</a></Button
		>
	</CardFooter>
</Card>
