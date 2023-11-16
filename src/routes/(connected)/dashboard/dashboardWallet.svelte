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
	import { getWeb3Store } from '$lib/context/getStores';
	import Eth from '$lib/eth.svelte';
	import Usdc from '$lib/usdc.svelte';

	const { format } = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	const theme = 'dark';
	const web3Store = getWeb3Store();

	$: usdcBalance = $web3Store?.balances['USDC']?.small ?? 0;
	$: ethBalance = $web3Store?.balances['WETH']?.small ?? 0;
	$: ethPrice = $web3Store?.ethPrice?.small ?? 0;
	$: ethBalanceUSD = ethBalance * ethPrice;
</script>

<Card class="w-full">
	<div class="flex flex-col justify-between flex-grow">
		<CardHeader>
			<CardTitle class="mb-5 md:text-2xl">Wallet Overview</CardTitle>
			<CardDescription>
				<p class="md:text-xl">
					A summary of your balances not currently in use. Go to your wallet to deposit more funds
					or withdraw.
				</p>
			</CardDescription>
		</CardHeader>
		<CardContent class="grid grid-cols-1  gap-4">
			<div class="flex items-center space-x-4">
				<div class="h=5 w-8 p-1">
					<Eth />
				</div>
				<div class="flex flex-col">
					<p class="text-sm md:text-xl font-medium leading-none">Ether in Wallet</p>
					<p class="text-xl md:tex-4xl font-bold">{ethBalance} ETH</p>
					<p class="text-sm md:text-xl italic">{format(ethBalanceUSD)}</p>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<div class="h=8 w-8">
					<Usdc dark={theme === 'dark' ? 'transparent' : 'black'} light="white" />
				</div>
				<div class="flex flex-col">
					<p class="text-sm md:text-xl font-medium leading-none">USDC in Wallet</p>
					<p class="text-xl md:text-xl font-bold">{format(usdcBalance)}</p>
				</div>
			</div>
		</CardContent>
	</div>
	<div>
		<Separator class="mb-5 md:mb-9" />
		<CardFooter class="md:mt-5">
			<Button class="w-full md:py-7">
				<a class="w-full md:text-xl md:py-3" href={ROUTES.WALLET}>Go To Wallet</a>
			</Button>
		</CardFooter>
	</div>
</Card>
