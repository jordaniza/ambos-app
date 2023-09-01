<script lang="ts">
	import { APP_NAME } from '$lib/constants';

	import ETH from '$lib/eth.svelte';
	import USDC from '$lib/usdc.svelte';
	import { web3Store } from '$stores/web3';

  const { format } = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  $: usdcBalance = $web3Store?.balances['USDC']?.small ?? 0;
  $: ethBalance = $web3Store?.balances['WETH']?.small ?? 0;
  $: ethPrice = $web3Store?.ethPrice?.small ?? 0;
  $: ethBalanceUSD = (ethBalance) * (ethPrice);

	let theme = 'dark';
</script>

<section class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
	<div class="card p-4">
		<div class="flex items-center p-2">
			<h1>Your Wallet</h1>
		</div>
		<hr class="my-3" />
		<p class="p-2 mb-4">
			This page shows your wallet balance in terms of Ether (ETH) and US Dollar Coin (USDC). You use
			this page to either purchase ETH, sell USDC for fiat currency or transfer ETH/USDC to another
			wallet. If you already have ETH or USDC, you can send them to your wallet address.
		</p>
	</div>

	<div class="card p-4">
		<div class="flex items-center p-2">
			<h1>Eth balance</h1>
		</div>
		<hr class="my-3" />
		<div>
			<section class="flex flex-col justify-between p-2">
				<p>
					ETH (or Ether) is the native cryptocurrency of the Ethereum blockchain. It has a variable
					price. You can purchase ETH with fiat currency or receive it from another wallet. the {APP_NAME}
					{' '}
					app allows you to supply your ETH as collateral, and borrow USDC which can be exchanged for
					any fiat currency of your choice.
				</p>
				<div class="flex flex-col mt-5">
					<p class="text-md font-bold leading-none mb-2">Balance</p>
					<div class="flex items-center space-x-4">
						<p class="text-xl font-bold">{ethBalance} ETH</p>
						<p class="text-xl">({format(ethBalanceUSD)})</p>
					</div>
				</div>
			</section>
		</div>
		<hr class="my-5" />
		<div class="card-footer flex justify-between">
			<button class="btn flex-auto variant-ghost-primary w-1/2 mr-2"> Buy </button>
			<button class="btn variant-ghost-surface w-1/2 ml-2"> Send/Receive </button>
		</div>
	</div>

	<div class="card p-4">
		<div class="flex items-center p-2">
			<h1>USDC Balance</h1>
		</div>
		<hr class="my-3" />
		<div>
			<section class="flex flex-col p-2">
				<p>
					USDC (or US Dollar Coin) is a Stablecoin that is pegged to the US Dollar. You can sell
					USDC for fiat currency or transfer USDC to another wallet.
				</p>
				<div class="flex flex-col mt-5">
					<p class="text-md leading-none mb-2 font-bold">Balance</p>
					<p class="text-xl font-bold">{format(usdcBalance)}</p>
				</div>
			</section>
			<hr class=" my-5" />
			<div class="card-footer flex justify-between">
				<button class="btn flex-auto variant-ghost-primary w-1/2 mr-2"> Sell</button>
				<button class="btn variant-ghost-surface w-1/2 ml-2"> Send/Receive</button>
			</div>
		</div>
	</div>
</section>
