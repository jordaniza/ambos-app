<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Eth from '$lib/eth.svelte';
	import { f, e, getBarColor, getLiquidationPrice } from '$lib/utils';
	import { CreditCardIcon, DollarSign, InfoIcon, LockIcon, Receipt } from 'lucide-svelte';
	import Sparkline from '$lib/components/charts/sparkline.svelte';
	import TopBar from './top-bar.svelte';
	import { getWeb3Store } from '$lib/context/getStores';
	import { LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
	import WelcomeDialog from './welcome-dialog.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { browser } from '$app/environment';

	let web3Store = getWeb3Store();
	let priceUp = Math.random() > 0.5;
	let resize: () => void;
	let seen: string | null = null;
	let showWelcome = false;
	let openEthDialog: () => void;

	$: {
		if (browser) {
			const key = LOCAL_STORAGE_KEYS.WELCOME;
			seen = localStorage.getItem(key);
			if (!seen) {
				showWelcome = true;
				localStorage.setItem(key, 'true');
			}
		}
	}

	// chart needs to update with correct decimal points for ETH price
	$: {
		if (ethPrice && resize) {
			resize();
		}
	}

	$: aWethBalance = $web3Store.balances['aWETH'].small ?? 0;
	$: liquidationThreshold = $web3Store.userPoolData?.currentLiquidationThreshold.small ?? 0;
	$: variableRateIR = $web3Store.poolReserveData?.variableBorrowingRate.small ?? 0;
	$: liquidationPrice = getLiquidationPrice(owedUSD, aWethBalance, liquidationThreshold);
	$: usdcBalance = $web3Store?.balances['USDC']?.small ?? 0;
	$: ethBalance = $web3Store?.balances['WETH']?.small ?? 0;
	$: owedUSD = $web3Store.userPoolData?.totalDebtBase.small ?? 0;
	$: ethPrice = $web3Store?.ethPrice?.small ?? 0;
	$: ethSupplied = $web3Store.balances['aWETH'].small ?? 0;
	$: ethBalanceUSD = ethBalance * ethPrice;
	$: totalBalance = ethBalanceUSD + usdcBalance;
	$: barWidth = (liquidationPrice / ethPrice) * 100;
	$: isSafe = barWidth < 70;
	$: barStyle = getBarColor(barWidth) + ' rounded-full h-full';

	function handleStartLoan() {
		openEthDialog();
	}
</script>

<section class="h-full w-full">
	<!-- Top Bar -->
	<TopBar />
	<WelcomeDialog startOpen={showWelcome} bind:openEthDialog />
	<!-- Total Balance -->
	<BaseScreen>
		<div
			slot="background"
			class="w-full h-full bg-contain bg-primary bg-top bg-[url('/backgrounds/home.png')]"
		/>

		<span slot="header" class="-mt-4">
			<h1 class="tracking-widest pb-1">Total Available Balance</h1>
			<h2 class="text-4xl tracking-widest">{f(totalBalance)}</h2>
		</span>

		<span slot="card">
			<!-- Balance Cards -->
			<div class="absolute transform -translate-y-1/2 flex gap-3 w-full justify-around px-6">
				<Card
					variant="popover"
					padding="base"
					class="w-1/2 text-popover bg-cover bg-center bg-no-repeat shadow-xl shadow-white tracking-widest"
					style="background-image: url('backgrounds/card-dashboard-eth.png');"
				>
					<div class="flex w-full justify-between">
						<div class="pb-2">
							<p class="text-lg font-extrabold">ETH</p>
							<p class="text-xs tracking-normal">Your Wallet</p>
						</div>
						<div class="rounded-full bg-background h-10 w-10 flex items-center justify-center">
							<img src="/external/eth.png" alt="ETH" class="h-5 w-5" />
						</div>
					</div>
					<div>
						<p class="text-xl">
							{e(ethBalance)}
						</p>
					</div>
				</Card>
				<Card
					variant="popover"
					padding="base"
					class="w-1/2 text-popover bg-cover bg-center bg-no-repeat shadow-xl shadow-white bg-blend-darken tracking-widest"
					style="background-image: url('backgrounds/card-dashboard-stable.png');"
				>
					<div class="flex justify-between">
						<div class="pb-2">
							<p class="text-lg font-extrabold">USDC</p>
							<p class="text-xs tracking-normal">Your Wallet</p>
						</div>
						<div class="rounded-full bg-background h-10 w-10 flex items-center justify-center">
							<img src="/external/usdc.png" alt="USDC" class="h-7 w-7" />
						</div>
					</div>
					<div>
						<p class="text-xl">{f(usdcBalance)}</p>
					</div>
				</Card>
			</div>
			<CardContent class="pt-10 flex flex-col gap-5">
				<!-- Section ETH Supplied -->
				<Card
					variant="popover"
					padding="base"
					class="text-sm tracing-wider mt-8 flex flex-col justify-between items-center gap-1 pb-3"
				>
					<div class="flex items-center justify-between pb-2 w-full">
						<div class="flex gap-2 items-center justify-start">
							<LockIcon class="text-muted-foreground h-4 w-4" />
							<p class="font-bold tracking-widest pt-1">Supplied</p>
						</div>
						<InfoIcon class="text-muted-foreground h-4 w-4" />
					</div>
					<div class="flex w-full justify-between gap-3 items-center">
						<div class="flex items-center gap-1">
							<div class="rounded-full bg-background h-10 w-10 flex items-center justify-center">
								<img src="/external/eth.png" alt="ETH" class="h-7 w-7" />
							</div>
							<div class="px-1 flex flex-col">
								<p class="font-bold flex-nowrap">Ether</p>
								<div class="flex text-sm gap-0 flex-nowrap">
									<p>ETH</p>
									<p class="px-[1px]">·</p>
									<p>USD</p>
								</div>
							</div>
						</div>
						<Sparkline bind:resize height={30} />
						<div>
							<p class="font-bold text-end">{e(ethSupplied)} ETH</p>
							<div class="flex text-xs items-center">
								<p class=" pr-1">{f(ethPrice)}</p>
								<p class={priceUp ? 'text-green-500' : 'text-red-500'}>
									{priceUp ? '↑+' : '↓-'}25.45%
								</p>
							</div>
						</div>
					</div>
				</Card>
				<!-- Section USD Borrows  -->
				<Card
					variant="popover"
					padding="base"
					class="text-sm py-4 flex flex-col w-full justify-between gap-2"
				>
					<div class="flex justify-between items-center">
						<div class="flex gap-1 items-center justify-start">
							<CreditCardIcon class="text-muted-foreground h-4 w-4" />
							<p class="tracking-widest font-bold pt-[1.5px]">Borrowed</p>
						</div>
						<InfoIcon class="text-muted-foreground h-4 w-4" />
					</div>
					<div class="flex w-full justify-between">
						<div class="flex items-center justify-center gap-2">
							<div class="rounded-full bg-background h-10 w-10 flex items-center justify-center">
								<DollarSign class="text-secondary stroke-2 h-7 w-7" />
							</div>
							<p class="font-bold pt-1">US Dollar</p>
						</div>
						<div class="flex flex-col">
							<p class="text-end font-bold">{f(owedUSD)}</p>
							<p class="text-xs text-muted-foreground">{owedUSD.toFixed(2)} USDC</p>
						</div>
					</div>
					<Card class="rounded-xl text-xs shadow-none p-2">
						<div class="flex justify-between font-bold">
							<p>Liquidation Price</p>
							<p>{f(liquidationPrice)}</p>
						</div>
						<div class="flex justify-between">
							<p>Interest Rate</p>
							<p>{variableRateIR.toFixed(4)}%</p>
						</div>
						<div class="flex items-center">
							<p class="flex-shrink-0 whitespace-nowrap">Loan Health</p>
							<div class="flex-shrink mx-2 w-full items-center justify-center">
								<div class="bg-gray-200 rounded-full h-2 w-full relative">
									<div class={barStyle} style={`width: ${barWidth}%;`} />
								</div>
							</div>
							<p class={isSafe ? 'text-secondary' : 'text-destructive'}>
								{isSafe ? 'SAFE' : 'WARNING'}
							</p>
						</div>
					</Card>
					<Card class="rounded-xl p-3 shadow-none">
						<div class="flex justify-between items-center">
							<div class="flex items-center gap-2">
								<Receipt class="text-secondary" />
								<p>Amount To Repay</p>
							</div>
							<div class="text-xs">
								<p class="text-end font-bold">{f(owedUSD)}</p>
								<p>{owedUSD.toFixed()} USDC</p>
							</div>
						</div>
					</Card>
				</Card>

				<!-- How it works and Get Started -->
				<section class="flex w-full gap-3 pt-5">
					<Card class="w-1/2 flex flex-col gap-2 items-center justify-between p-3 relative">
						<img
							src="/illustrations/how-ambos-works.png"
							alt="How Ambos Works"
							class="rounded-full h-12 w-12 overflow-visible -top-5 absolute"
						/>
						<p class="text-center pt-6">How Ambos works?</p>
						<Button disabled={true} variant="outline" class="w-full">Discover</Button>
					</Card>
					<Card class="w-1/2 flex flex-col gap-2 items-center justify-between p-3 relative">
						<img
							src="/illustrations/get-a-loan.png"
							alt="Get a Loan"
							class="rounded-full h-12 w-12 overflow-visible -top-5 absolute"
						/>
						<p class="text-center pt-6">Get a loan</p>
						<Button class="w-full" on:click={handleStartLoan}>Get Started</Button>
					</Card>
				</section>

				<!-- Referral -->
				<Card class="bg-secondary p-4 text-white flex justify-between items-center gap-3">
					<div>
						<p class="text-sm font-light">Refer Rewards</p>
						<p class="text-lg">Earn $5 Rewards for every successful referral.</p>
					</div>
					<div>
						<img
							src="/illustrations/refer-a-friend.png"
							alt="Refer a Friend"
							class="rounded-full h-20 w-28 overflow-visible"
						/>
					</div>
				</Card>
			</CardContent>
			<div class="h-72" />
		</span>
	</BaseScreen>
</section>
