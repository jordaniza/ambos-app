<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Eth from '$lib/eth.svelte';
	import { f, e } from '$lib/utils';
	import { CreditCard, DollarSign } from 'lucide-svelte';
	import Sparkline from '$lib/components/charts/sparkline.svelte';
	import TopBar from './top-bar.svelte';
	import { getWeb3Store } from '$lib/context/getStores';
	import { ROUTES } from '$lib/constants';
	import WelcomeDialog from './welcome-dialog.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';

	let web3Store = getWeb3Store();
	let priceUp = Math.random() > 0.5;
	let resize: () => void;

	function getLiquidationPrice(
		debtValueUSD: number,
		collateralInEth: number,
		maxLTV: number
	): number {
		// we need to work out the price at which the collateral becomes worth less than maxLTV% of the debtValueUSD
		// P = (D / C) / (maxLTV)
		// Eg: ($5000 Debt / 2 ETH) = $2500 per ETH
		//    $2500 per ETH / (50% maxLTV) = $5000 per ETH
		if (collateralInEth === 0 || maxLTV === 0) return 0;
		const debtPerCollateralDeposited = debtValueUSD / collateralInEth;
		const liquidationPrice = debtPerCollateralDeposited / maxLTV;
		return liquidationPrice;
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
	$: isSafe = barWidth < 50;
	$: barStyle = (isSafe ? 'bg-primary' : 'bg-destructive') + ' rounded-full h-full';
</script>

<section class="h-full w-full">
	<!-- Top Bar -->
	<TopBar />
	<WelcomeDialog startOpen={false} />
	<!-- Total Balance -->
	<BaseScreen>
		<span slot="header">
			<h1 class="tracking-wider">Total Available Balance</h1>
			<h2 class="text-4xl font-bold tracking-widest">{f(totalBalance)}</h2>
		</span>

		<span slot="card">
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
						<p class="text-xl font-bold">
							{e(ethBalance)}
						</p>
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
						<p class="text-xl font-bold">{f(usdcBalance)}</p>
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
						<Sparkline bind:resize />
						<div>
							<p class="font-bold text-end">{e(ethSupplied)} ETH</p>
							<div class="flex text-xs items-center">
								<p class="text-base pr-1">{f(ethPrice)}</p>
								<p class={priceUp ? 'text-green-500' : 'text-red-500'}>
									{priceUp ? '↑+' : '↓-'}25.45%
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
								<p class="text-end font-bold">{f(owedUSD)}</p>
								<p class="text-xs">{owedUSD.toFixed(2)} USDC</p>
							</div>
						</div>
						<Card class="rounded-xl bg-popover p-3 text-xs">
							<div class="flex justify-between font-bold">
								<p>Liquidation Price</p>
								<p>{f(liquidationPrice)}</p>
							</div>
							<div class="flex justify-between">
								<p>Interest Rate</p>
								<p>{variableRateIR.toFixed(4)}%</p>
							</div>
							<div class="flex justify-between items-center">
								<p>Collateral</p>
								<div class="bg-gray-200 rounded-full mx-2 h-2 w-full">
									<div class={barStyle} style={`width: ${barWidth}%;`} />
								</div>
								<p class={isSafe ? 'text-secondary' : 'text-destructive'}>
									{isSafe ? 'SAFE' : 'WARNING'}
								</p>
							</div>
						</Card>
						<Card class="rounded-xl bg-popover p-3">
							<div class="flex justify-between items-center">
								<div class="flex gap-2">
									<CreditCard class="text-secondary" />
									<p>Amount To Repay</p>
								</div>
								<div class="text-xs">
									<p class="text-end font-bold">{f(owedUSD)}</p>
									<p>{owedUSD.toFixed()} USDC</p>
								</div>
							</div>
						</Card>
					</Card>
				</section>

				<!-- How it works and Get Started -->
				<section class="flex w-full gap-3">
					<Card class="w-1/2 flex flex-col gap-2 items-center justify-between p-3 relative">
						<div class="rounded-full h-12 w-12 bg-gray-300 -top-5 absolute" />
						<p class="text-center pt-6">How Ambos works?</p>
						<Button variant="outline" class="w-full">Discover</Button>
					</Card>
					<Card class="w-1/2 flex flex-col gap-2 items-center justify-between p-3 relative">
						<div class="rounded-full h-12 w-12 bg-gray-300 -top-5 absolute" />
						<p class="text-center pt-6">Get a loan</p>
						<Button class="w-full"><a href={ROUTES.NEW_LOAN} class="w-full">Get Started</a></Button>
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
		</span>
	</BaseScreen>
</section>
