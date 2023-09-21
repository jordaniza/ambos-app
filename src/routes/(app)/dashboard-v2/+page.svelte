<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Eth from '$lib/eth.svelte';
	import { USDC, f } from '$lib/utils';
	import Footer from './footer.svelte';
	import Sparkline from './sparkline.svelte';
	import TopBar from './top-bar.svelte';

	let totalBalance = f(33500);
	let ethPrice = 1650;
	let priceUp = true;
	import { CreditCard, DollarSign } from 'lucide-svelte';
	let liquidationPrice = 12322;
	let interestRate = 0.05;
</script>

<div class="h-full absolute inset-0 -z-10 bg-primary" />
<section class="h-full w-full">
	<!-- Top Bar -->
	<TopBar />

	<!-- Total Balance -->
	<div class="text-white flex flex-col items-center justify-start pt-2 h-1/6 min-h-[140px]">
		<h1 class="tracking-wider">Total Available Balance</h1>
		<h2 class="text-4xl font-bold tracking-widest">{totalBalance}</h2>
	</div>

	<Card class="h-5/6 rounded-3xl w-full relative bg-background">
		<!-- Balance Cards -->
		<div class="absolute transform -translate-y-1/2 flex gap-3 w-full justify-around">
			<Card class="py-2 px-4 w-1/2 ml-4 bg-popover">
				<div class="flex w-full justify-between">
					<div class="pb-2">
						<p class="text-lg font-extrabold">ETH</p>
						<p class="text-sm text-secondary">Wallet</p>
					</div>
					<Eth height="30" width="20" />
				</div>
				<div>
					<p class="text-xl font-bold">0.1512</p>
				</div>
			</Card>
			<Card class="py-2 px-4 w-1/2 mr-4 bg-popover">
				<div class="flex justify-between">
					<div class="pb-2">
						<p class="text-lg font-extrabold">USDC</p>
						<p class="text-sm text-secondary">Wallet</p>
					</div>
					<DollarSign height="30" width="20" />
				</div>
				<div>
					<p class="text-xl font-bold">{f(13030)}</p>
				</div>
			</Card>
		</div>
		<CardContent class="pt-10 flex flex-col gap-10">
			<!-- Section ETH Supplied -->
			<section class="mt-10">
				<div class="flex justify-between pb-2">
					<p>Supplied</p>
					<p class="text-sm text-secondary">Amount Used As Collateral</p>
				</div>
				<Card class="p-4 flex justify-between items-center gap-2">
					<div>
						<Eth height="40" width="30" />
					</div>
					<div>
						<p class="font-bold">Ethereum</p>
						<p class="text-sm">ETH · USD</p>
					</div>
					<Sparkline />
					<div>
						<p class="font-bold text-end">1.1 ETH</p>
						<div class="flex text-xs items-center">
							<p class="text-base pr-1">{f(ethPrice)}</p>
							<p class={priceUp ? 'text-green-500' : 'text-red-500'}>
								{priceUp ? '↑' : '↓'}+25.45%
							</p>
						</div>
					</div>
				</Card>
			</section>
			<!-- Section USD Borrows  -->
			<section>
				<div class="flex justify-between items-center pb-2">
					<p>Borrowed</p>
				</div>
				<Card class="p-4 flex flex-col gap-2">
					<div class="flex w-full justify-between">
						<div class="flex items-center justify-center gap-2">
							<DollarSign class="text-secondary ml-1" />
							<p class="font-bold pt-1">US Dollar</p>
						</div>
						<div class="flex flex-col">
							<p class="text-end font-bold">{f(123232)}</p>
							<p class="text-xs">123231.95 USDC</p>
						</div>
					</div>
					<Card class="rounded-xl bg-popover p-3 text-xs">
						<div class="flex justify-between font-bold">
							<p>Liquidation Price</p>
							<p>{f(liquidationPrice)}</p>
						</div>
						<div class="flex justify-between">
							<p>Interst Rate</p>
							<p>{interestRate}%</p>
						</div>
						<div class="flex justify-between items-center">
							<p>Collateral</p>
							<div class="bg-gray-200 rounded-full mx-2 h-2 w-full">
								<div class="bg-primary rounded-full h-full" style="width: 67%;" />
							</div>
							<p class="text-secondary">SAFE</p>
						</div>
					</Card>
					<Card class="rounded-xl bg-popover p-3">
						<div class="flex justify-between items-center">
							<div class="flex gap-2">
								<CreditCard class="text-secondary" />
								<p>Amount To Repay</p>
							</div>
							<div class="text-xs">
								<p class="text-end font-bold">{f(329329)}</p>
								<p>{329328} USDC</p>
							</div>
						</div>
					</Card>
				</Card>
			</section>

			<!-- How it works and Get Started -->
			<section class="flex w-full gap-3">
				<Card class="w-1/2 flex flex-col gap-2 items-center justify-center p-3 relative">
					<div class="rounded-full h-12 w-12 bg-gray-300 -top-5 absolute" />
					<p class="text-center pt-6">How Ambos works?</p>
					<Button variant="outline" class="w-full">Discover</Button>
				</Card>
				<Card class="w-1/2 flex flex-col gap-2 items-center justify-center p-3 relative">
					<div class="rounded-full h-12 w-12 bg-gray-300 -top-5 absolute" />
					<p class="text-center pt-6">Get a loan</p>
					<Button class="w-full">Get Started</Button>
				</Card>
			</section>

			<!-- Referral -->
			<Card class="bg-secondary p-4 text-white flex justify-between items-center gap-3">
				<div>
					<p class="text-sm font-light">Refer Rewards</p>
					<p class="text-lg">Earn $5 Rewards for every successful referral.</p>
				</div>
				<div>
					<div class="rounded-full bg-gray-300 h-12 w-12" />
				</div>
			</Card>
		</CardContent>
		<div class="bg-background h-20" />
	</Card>
</section>
<Footer />
