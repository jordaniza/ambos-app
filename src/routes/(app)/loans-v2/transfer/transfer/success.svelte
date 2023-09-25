<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { ROUTES } from '$lib/constants';
	import { CheckCircle as Check } from 'lucide-svelte';
</script>

<Card class="bg-popover px-4 py-2 flex flex-col items-center text-center gap-3">
	<h2 class="font-bold text-lg pt-3">Transaction Successful</h2>
	<Check class="h-20 w-20 text-primary stroke-1 " />
	<p>
		Congratulations! You have successfully transferred your Ethereum to your wallet. You are ready
		to proceed with your loan.
	</p>
	<div class="flex gap-3 items-center w-full pb-3">
		<Button class="w-1/2" variant="outline" on:click={() => goto(ROUTES.DASHBOARD_V2)}
			>Go To Dashboard</Button
		>
		<Button class="w-1/2" on:click={() => goto(ROUTES.LOANS_V2_REVIEW)}>Review Loan Details</Button>
	</div>
</Card>
