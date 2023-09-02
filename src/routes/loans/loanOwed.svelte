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
	import { web3Store } from '$stores/web3';


  $: owed =  $web3Store.userPoolData?.totalDebtBase.small ?? 0;
  $: availableToBorrow = $web3Store.userPoolData?.availableBorrowBase.small ?? 0;
  $: variableRateIR = $web3Store.poolReserveData?.variableBorrowingRate.small ?? 0;

</script>

<Card class={cn('w-full')}>
	<CardHeader>
		<CardTitle>Owed</CardTitle>
		<CardDescription>
			This is the total amount you need to repay in USDC to unlock and reclaim your ETH. It is the
			original amount in USD, plus accumulated interest.
		</CardDescription>
	</CardHeader>
	<CardContent>
		<ul class="list-disc list-inside">
			<li class="flex justify-between">
				<div>Total Borrowed</div>
				<div>{f(owed)}</div>
			</li>
			<li class="flex justify-between">
				<div>Available To Borrow</div>
				<div>{f(availableToBorrow)}</div>
			</li>
			<li class="flex justify-between">
				<div>Interest Rate</div>
				<div>{variableRateIR.toFixed(2)}%</div>
			</li>
		</ul>
	</CardContent>
	<Separator class=" mb-5" />
	<CardFooter>
		<Button class="w-1/2 mr-1">Repay</Button>
		<Button class="w-1/2 ml-1" variant="secondary">Borrow More</Button>
	</CardFooter>
</Card>
