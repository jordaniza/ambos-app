<script>
	import { ROUTES } from '$lib/constants';
	import { web3Store } from '$stores/web3';

	const { format } = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	$: usdcBalance = $web3Store?.balances['USDC']?.small ?? 0;
	$: ethBalance = $web3Store?.balances['WETH']?.small ?? 0;
	$: ethPrice = $web3Store?.ethPrice?.small ?? 0;
	$: ethBalanceUSD = ethBalance * ethPrice;
</script>

<div class="card p-4 m-2">
	<div>
		<h1 class="my-5">Wallet Overview</h1>
		<p>
			A summary of your balances not currently in use. Go to your wallet to deposit more funds or
			withdraw.
		</p>
	</div>
	<hr class="my-5" />

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="flex items-center space-x-4">
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">Ether in Wallet</p>
				<p class="text-xl font-bold">{ethBalance} ETH</p>
				<p class="text-sm italic">{format(ethBalanceUSD)}</p>
			</div>
		</div>
		<div class="flex items-center space-x-4">
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">USDC in Wallet</p>
				<p class="text-xl font-bold">{format(usdcBalance)}</p>
			</div>
		</div>
	</div>
  <hr class="my-5" />
	<div>
		<button class="btn variant-filled-primary w-full">
			<a class="w-full" href={ROUTES.WALLET}>Go To Wallet</a>
		</button>
	</div>
</div>
