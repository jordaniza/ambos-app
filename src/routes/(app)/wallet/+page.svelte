<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { APP_NAME, ROUTES } from '$lib/constants';
	import { getWeb3Store } from '$lib/context/getStores';

	import ETH from '$lib/eth.svelte';
	import USDC from '$lib/usdc.svelte';
	import { cn, f } from '$lib/utils';

	let web3Store = getWeb3Store();

	$: usdcBalance = $web3Store?.balances['USDC']?.small ?? 0;
	$: ethBalance = $web3Store?.balances['WETH']?.small ?? 0;
	$: ethPrice = $web3Store?.ethPrice?.small ?? 0;
	$: ethBalanceUSD = ethBalance * ethPrice;
	$: isTestnet = $web3Store.isTestnet;

	let theme = 'dark';
</script>

<section class="p-4 grid grid-cols-1 gap-4">
	<Card class={cn('w-full')}>
		<CardHeader>
			<CardTitle>Your Wallet</CardTitle>
			<CardDescription>
				This page shows your wallet balance in terms of Ether (ETH) and US Dollar Coin (USDC). You
				use this page to either purchase ETH, sell USDC for fiat currency or transfer ETH/USDC to
				another wallet. If you already have ETH or USDC, you can send them to your wallet address.
			</CardDescription>
		</CardHeader>
	</Card>

	<Card class={cn('w-full')}>
		<CardHeader>
			<div class="flex items-center">
				<div class="h-10 w-10 mr-2">
					<ETH />
				</div>
				<CardTitle>ETH Balance</CardTitle>
			</div>
		</CardHeader>
		<Separator class="mb-5" />
		<CardContent class="">
			<section class="flex flex-col justify-between">
				<p>
					ETH (or Ether) is the native cryptocurrency of the Ethereum blockchain. It has a variable
					price. You can purchase ETH with fiat currency or receive it from another wallet. the {APP_NAME}
					{' '}
					app allows you to supply your ETH as collateral, and borrow USDC which can be exchanged for
					any fiat currency of your choice.
				</p>
				<div class="flex flex-col mt-5">
					<p class="text-md leading-none mb-2">Balance</p>
					<div class="flex items-center space-x-4">
						<p class="text-xl font-bold">{ethBalance} ETH</p>
						<p class="text-xl">({f(ethBalanceUSD)})</p>
					</div>
				</div>
			</section>
		</CardContent>
		<Separator class=" mb-5" />
		<CardFooter>
			<Button disabled class="w-1/2 mr-1">Buy (Soon)</Button>
			<Button class="w-1/2 ml-1" variant="secondary">
				<a href={isTestnet ? ROUTES.FAUCET : ROUTES.PROFILE}>Get ETH</a>
			</Button>
		</CardFooter>
	</Card>

	<Card class={cn('w-full')}>
		<CardHeader>
			<div class="flex items-center">
				<div class="h-10 w-10 mr-2">
					<USDC dark={theme === 'dark' ? 'transparent' : 'black'} light="white" />
				</div>
				<CardTitle>USDC Balance</CardTitle>
			</div>
		</CardHeader>
		<Separator class="mb-5" />
		<CardContent class="">
			<section class="flex flex-col justify-between">
				<p>
					USDC (or US Dollar Coin) is a Stablecoin that is pegged to the US Dollar. You can sell
					USDC for fiat currency or transfer USDC to another wallet.
				</p>
				<div class="flex flex-col mt-5">
					<p class="text-md leading-none mb-2">Balance</p>
					<p class="text-xl font-bold">{f(usdcBalance)}</p>
				</div>
			</section>
		</CardContent>
		<Separator class=" mb-5" />
		<CardFooter>
			<Button disabled class="w-1/2 mr-1">Sell (Soon)</Button>
			<Button class="w-1/2 ml-1" variant="secondary">
				<a href={ROUTES.SEND_USDC}>Send</a>
			</Button>
		</CardFooter>
	</Card>
</section>
