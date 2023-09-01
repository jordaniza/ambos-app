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
	import Eth from '$lib/eth.svelte';
	import Usdc from '$lib/usdc.svelte';
	import { web3Store } from '$stores/web3';

	const { format } = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	const theme = 'dark';

	$: usdcBalance = $web3Store?.balances['USDC']?.small ?? 0;
	$: ethBalance = $web3Store?.balances['WETH']?.small ?? 0;
	$: ethPrice = $web3Store?.ethPrice?.small ?? 0;
	$: ethBalanceUSD = ethBalance * ethPrice;
</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle class="mb-5">Wallet Overview</CardTitle>
		<CardDescription>
			A summary of your balances not currently in use. Go to your wallet to deposit more funds or
			withdraw.
		</CardDescription>
	</CardHeader>
	<CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="flex items-center space-x-4">
			<div class="h=5 w-8 p-1">
				<Eth />
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">Ether in Wallet</p>
				<p class="text-xl font-bold">{ethBalance} ETH</p>
				<p class="text-sm italic">{format(ethBalanceUSD)}</p>
			</div>
		</div>
		<div class="flex items-center space-x-4">
			<div class="h=8 w-8">
				<Usdc dark={theme === 'dark' ? 'transparent' : 'black'} light="white" />
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">USDC in Wallet</p>
				<p class="text-xl font-bold">{format(usdcBalance)}</p>
			</div>
		</div>
	</CardContent>
	<Separator class="mb-5" />
	<CardFooter>
		<Button class="w-full">
			<a class="w-full" href={ROUTES.WALLET}>Go To Wallet</a>
		</Button>
	</CardFooter>
</Card>
