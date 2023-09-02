<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { APP_NAME, WHAT_IS_AAVE } from '$lib/constants';
	import { cn } from '$lib/utils';
	import LoanHealth from './loanHealth.svelte';
	import LoanOwed from './loanOwed.svelte';
	let maxLTV = 50;
</script>

<section class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
	<Card class={cn('w-full')}>
		<CardHeader>
			<CardTitle>Loans</CardTitle>
			<CardDescription>
				Here you can see your loan positions and manage your loan balances. Loans are made in ETH
				and allow you to withdraw USDC, which can be converted for a currency of your choice.
				<br />
				<br />
				If the value of your ETH drops below{' '}
				{maxLTV}% of the US Dollar value of the loan, you will be at risk of being liqudiated and
				your ETH will be used to pay off the loan automatically. If this happens, you do not need to
				repay the loan.
				<br />
				<br />
				{APP_NAME}{' '}
				places restrictions on the amount you can borrow to give you a safety buffer, this is currently
				set at {maxLTV}%.
			</CardDescription>
		</CardHeader>
		<Separator class=" mb-5" />
		<CardFooter>
			<Button class="w-1/2 mr-1">Get Started</Button>
			<Button class="w-1/2 ml-1" variant="secondary">
				<a href={WHAT_IS_AAVE} target="_blank" class="w-full"> More Info </a>
			</Button>
		</CardFooter>
	</Card>
  <LoanOwed />
  <LoanHealth />
</section>
