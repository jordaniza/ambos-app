<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { APP_NAME, WHAT_IS_AAVE } from '$lib/constants';
	import DashboardLoans from './dashboard/dashboardLoans.svelte';
	import DashboardWallet from './dashboard/dashboardWallet.svelte';
</script>

<section class="p-4 grid grid-cols-1 gap-2">
	<Card>
		<CardHeader>
			<CardTitle class="mb-5">Welcome To {APP_NAME}</CardTitle>
			<CardDescription>
				{APP_NAME} gives you the freedom to
				<span class="font-bold">save for tomorrow, while spending today.</span>
				<br />
				<br />
				Buy or deposit crypto, and get the fiat currency of your choice back, to spend anywhere.
			</CardDescription>
			<a href={WHAT_IS_AAVE} target="_blank">
				<Button variant="link" class="text-left pl-0 ml-0 mt-3">Here's how it works</Button>
			</a>
		</CardHeader>
	</Card>
	<DashboardLoans />
	<DashboardWallet />
</section>

