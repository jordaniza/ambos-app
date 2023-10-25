<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { f, e, getBarColor, getLiquidationPrice, pc } from '$lib/utils';
	import { CreditCardIcon, DollarSign, LockIcon, Receipt } from 'lucide-svelte';
	import TopBar from './top-bar.svelte';
	import { getWeb3Store } from '$lib/context/getStores';
	import { AFFILIATE_LINK, DISCOVER_AMBOS, LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
	import WelcomeDialog from './welcome-dialog.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import EthSparkline from './ethSparkline.svelte';
	import { goto } from '$app/navigation';
	import EthPriceTicker from '$lib/components/charts/eth-price-ticker.svelte';

	let web3Store = getWeb3Store();
	let openEthDialog: () => void;

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
	<WelcomeDialog bind:openEthDialog />
	<!-- Total Balance -->
	<BaseScreen>
		<div
			slot="background"
			class="w-full h-full bg-contain bg-primary bg-top bg-[url('/backgrounds/home.png')]"
		/>

		<span slot="header" class="-mt-4">
			<h1 class=" pb-1">Total Available Balance</h1>
			<h2 class="text-3xl">{f(totalBalance)}</h2>
		</span>

		<span slot="card">
			<!-- Balance Cards -->
			<div class="absolute transform -translate-y-1/2 flex gap-3 w-full justify-around px-6">
				<Card
					variant="popover"
					padding="base"
					class="w-1/2 text-popover bg-cover bg-center bg-no-repeat shadow-xl shadow-white"
					style="background-image: url('backgrounds/card-dashboard-eth.png');"
				>
					<button class="w-full h-full" on:click={() => goto(ROUTES.WALLET)}>
						<div class="flex w-full justify-between text-left">
							<div class="pb-2">
								<p class="text-lg font-extrabold">ETH</p>
								<p class="text-xs whitespace-nowrap text-gray-400">Your Ambos Wallet</p>
							</div>
							<div
								class="rounded-full bg-background h-6 w-6 flex items-center justify-center transform translate-y-1 translate-x-1"
							>
								<img src="/external/eth.png" alt="ETH" class="h-4 w-4" />
							</div>
						</div>
						<div class="text-left">
							<p class="text-xl">
								{e(ethBalance)}
							</p>
						</div>
					</button>
				</Card>
				<Card
					variant="popover"
					padding="base"
					class="w-1/2 text-popover shadow-xl shadow-white bg-blend-darken  card-stablecoin-image-darken"
				>
					<button class="w-full h-full" on:click={() => goto(ROUTES.WALLET)}>
						<div class="flex justify-between text-left">
							<div class="pb-2">
								<p class="text-lg font-extrabold">USDC</p>
								<p class="text-xs whitespace-nowrap text-gray-400">Your Ambos Wallet</p>
							</div>
							<div
								class="rounded-full bg-background h-6 w-6 flex items-center justify-center transform translate-y-1 translate-x-1"
							>
								<img src="/external/usdc.png" alt="USDC" class="h-4 w-4" />
							</div>
						</div>
						<div class="w-full text-left">
							<p class="text-xl">{f(usdcBalance)}</p>
						</div>
					</button>
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
							<p class="font-bold pt-1">Supplied</p>
						</div>
						<TooltipIcon text={TOOLTIPS.ETH_SUPPLIED} />
					</div>
					<div class="flex w-full justify-between gap-3 items-center max-w-full">
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
						<EthSparkline />
						<div class="flex flex-col text-end">
							<div class="flex gap-1 font-bold">
								<p>{e(ethSupplied)}</p>
								<p>ETH</p>
							</div>
							<div class="flex flex-col text-xs items-end justify-end">
								<p>{f(ethPrice)}</p>
								<EthPriceTicker />
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
							<p class=" font-bold pt-[1.5px]">Borrowed</p>
						</div>
						<TooltipIcon text={TOOLTIPS.USD_BORROWED} />
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
						<p class="text-center pt-6">How Ambos works</p>
						<Button variant="outline" class="w-full">
							<a class="w-full" href={DISCOVER_AMBOS} target="_blank">Discover</a>
						</Button>
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
				<button class="bg-secondary p-4 rounded-2xl text-start text-white">
					<a
						class="w-full flex justify-between items-center gap-3"
						href={AFFILIATE_LINK}
						target="_blank"
					>
						<div>
							<p class="text-sm font-light">Refer Rewards</p>
							<p class="text-lg">Join the Ambos Referral Programme and Earn Rewards</p>
						</div>
						<div>
							<img
								src="/illustrations/refer-a-friend.png"
								alt="Refer a Friend"
								class="rounded-full h-20 w-28 overflow-visible"
							/>
						</div>
					</a>
				</button>
			</CardContent>
			<div class="h-72" />
		</span>
	</BaseScreen>
</section>
