<script lang="ts">
	import Eth from '$lib/eth.svelte';
	import { f } from '$lib/utils';
	import * as Accordion from '$lib/components/ui/accordion';

	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import Range from '$lib/components/range/range.svelte';
	import { ArrowRight, ChevronDown, ChevronRight, InfoIcon, MoveRightIcon } from 'lucide-svelte';
	import CalculatorBars from '$lib/components/charts/calculatorBars.svelte';
	import AccordionItem from '$lib/components/ui/accordion/accordion-item.svelte';
	import Faq from '../../(landing)/components/FAQ.svelte';

	let ethSupply = 10; // Initial value
	let borrowAmount = 0; // Initial value
	let ethPrice = 0; // Initial or fetched value
	let fetchedAt: Date;
	let newEthPrice = 0;
	let ethPriceChange = 20; // Initial value

	let ambosFee = 0.01; // 1%
	let ambosFeeWhole = ambosFee * 100;
	let networkFees = 20;
	let exchangeFees = 0.03; // 3%
	let exchangeFeesWhole = exchangeFees * 100;
	let liquidationThreshold = 0.85; // 85%
	let interestRate = 0.05; // 5%

	// Computed values
	$: interest = borrowAmount * interestRate;
	$: minDepositValue = (borrowAmount + interest) / liquidationThreshold;
	$: liquidationPrice = ethSupply > 0 ? minDepositValue / ethSupply : 0;

	$: ethSupplyValue = ethSupply * ethPrice;
	$: ambosFeeValue = ethSupplyValue * ambosFee;
	$: exchangeFeeValue = ethSupplyValue * exchangeFees;
	$: totalFees = ambosFeeValue + networkFees + exchangeFeeValue;
	// $: depositValue = Math.max(ethSupplyValue - totalFees, 0);
	$: depositQtyAfterFees = ethPrice > 0 ? depositValue / ethPrice : 0;
	$: totalFeePercentage = ethSupplyValue > 0 ? (totalFees / ethSupplyValue) * 100 : 0;
	$: newEthPrice = ethPrice * (1 + ethPriceChange / 100);
	$: liquidated = liquidationPrice > newEthPrice;
	$: newDepositValue = liquidated ? 0 : depositQtyAfterFees * newEthPrice;
	$: ethRemainingIfUserHadSold = ethSupplyValue - borrowAmount;
	$: ethValueIfUserHadSold = (ethRemainingIfUserHadSold / ethPrice) * newEthPrice;
	$: changeVsSell = newDepositValue - ethSupplyValue - interest;
	$: changeVsSellPercentage = newDepositValue > 0 ? (changeVsSell / ethSupplyValue) * 100 : 0;
	$: changeInEthPrice = ((newEthPrice - ethPrice) / ethPrice) * 100;

	$: depositUSD = depositValue * ethPrice;
	$: maxBorrow = depositUSD / 2;
	$: {
		if (borrowAmount > maxBorrow) {
			borrowAmount = maxBorrow;
		}
	}

	let depositValue = ethSupply / 2;

	// More logic here$lib.
	async function fetchEthPrice() {
		try {
			const response = await fetch(
				'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
			);
			const data = await response.json();
			ethPrice = data.ethereum.usd;
			fetchedAt = new Date();
			setTimeout(() => (borrowAmount = maxBorrow * 0.5), 0);
		} catch (error) {
			console.error(error);
		}
	}
	onMount(fetchEthPrice);
	const FAQ = [
		{
			idx: 15,
			Q: "Why the name 'Ambos Finance'?",
			A: "Ambos is a Spanish word meaning 'both', because Ambos let's you have it both ways - you are able to get cash out of your crypto without selling it, and still have the upside of your crypto investments."
		}
	];
</script>

<!-- <Faq /> -->
<BaseScreen>
	<div slot="header" class="pb-5">
		<BackButton />
		<div class="pt-5 px-4">
			<h1 class="font-extrabold text-2xl pb-3 tracking-widest">Ambos Loans Calculator</h1>
			<p>Start discovering how much you can borrow against your Ethereum.</p>
		</div>
	</div>
	<div slot="card" class="p-4 flex flex-col gap-5 pb-20">
		<Card class=" text-center bg-popover">
			<CardContent class="flex flex-col gap-5">
				<!-- Eth Supply -->
				<div class="py-4">
					<p class="font-extrabold text-md tracking-widest">How much ETH do you want to deposit?</p>

					<div class="py-3">
						<Range bind:value={depositValue} max={ethSupply} step={0.01} />
					</div>
					<Button
						variant="outline"
						class="border-secondary bg-popover shadow-md font-bold py-6 w-full"
						>{depositValue} ETH - {f(depositUSD)}</Button
					>
				</div>
				<!-- USD Borrow -->
				<div>
					<p class="font-extrabold text-md tracking-widest">How much USD do you want to borrow?</p>
					<div class="py-3">
						<Range bind:value={borrowAmount} max={maxBorrow} />
					</div>
					<Button
						variant="outline"
						class="border-secondary bg-popover shadow-md font-bold py-6 w-full"
						>{f(borrowAmount)} - {f(maxBorrow)}</Button
					>
					<p class="text-xs text-muted-foreground py-3">Increase the ETH deposit to borrow more</p>
				</div>
				<!-- Stats -->
				<section class="text-xs flex flex-col gap-3">
					<!-- Min Deposit value && interet rate -->
					<div class="flex w-full gap-2">
						<div class="bg-background w-1/2 rounded-2xl px-3 py-2 text-left">
							<p class="font-bold">Min Deposit Value</p>
							<p>{f(2392)}</p>
						</div>
						<div class="bg-background w-1/2 rounded-2xl px-3 py-2 text-left">
							<p class="font-bold">Interest Rate</p>
							<p>{interestRate}%</p>
						</div>
					</div>

					<!-- Liquidation info -->
					<div class="flex w-full justify-between bg-background rounded-2xl px-3 py-2">
						<div class="font-bold">Liquidation Price</div>
						<div class="flex gap-1 text-end">
							<div>{f(liquidationPrice)} / ETH</div>
							<InfoIcon class="h-4 text-muted-foreground" />
						</div>
					</div>

					<!-- Fees and Charges -->
					<Accordion.Root class="flex w-full justify-between bg-background rounded-2xl px-3 py-2">
						<Accordion.Item value="item-1" class="w-full">
							<Accordion.Trigger class="w-full">
								<div class="font-bold">Est. Fees & Charges</div>
								<div slot="trigger-right">
									{f(123)} <span class="pl-1 text-muted-foreground">12.34%</span>
								</div>
							</Accordion.Trigger>
							<Accordion.Content>
								<div class="pt-2">
									<div class="flex w-full justify-between">
										<p>Ambos Fee</p>
										<div>
											<p>{f(1234)}</p>
										</div>
									</div>
									<div class="flex w-full justify-between">
										<p>Est. Exchange Fees</p>
										<div>
											<p>{f(1234)}</p>
										</div>
									</div>
									<div class="flex w-full justify-between">
										<p>Est. Network Fees</p>
										<div>
											<p>{f(1234)}</p>
										</div>
									</div>
								</div>
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>

					<Button class="w-full rounded-xl mt-2 py-6 text-base">Start Borrowing Now!</Button>
					<Button variant="link" class="pb-0">Check out the loan terms</Button>
				</section>
			</CardContent>
		</Card>

		<!-- Simulate results -->
		<Card class=" text-center bg-popover mb-10">
			<CardContent class="flex flex-col gap-5">
				<div class="py-4 flex flex-col gap-2">
					<p class="font-extrabold text-md tracking-widest">Simulate Results</p>
					<p class="tracking widest">ETH price in 1 year</p>

					<div class="py-3">
						<Range bind:value={newEthPrice} max={3 * ethPrice} step={1} />
					</div>
					<Button
						variant="outline"
						class="border-secondary bg-popover shadow-md py-6 w-full font-bold"
						>{f(newEthPrice)}
						<span
							class={(newEthPrice >= ethPrice ? 'text-primary' : 'text-destructive') +
								' font-thin pl-2'}
						>
							{#if changeInEthPrice > 0}
								+
							{/if}
							{changeInEthPrice.toFixed(2)}%
						</span>
					</Button>
				</div>
				<!-- Sim stats -->
				<div class="bg-background rounded-xl px-2 py-3 text-xs flex flex-col gap-2">
					<div class="flex justify-between">
						<p class="font-bold">You deposited</p>
						<p>{f(depositUSD)} in USD</p>
					</div>
					<div class="flex justify-between">
						<p class="font-bold">You borrowed</p>
						<p class="text-destructive">{f(borrowAmount)} in USD</p>
					</div>
					<div class="flex justify-between">
						<p class="font-bold">Profit - including fees</p>
						<p class="text-primary">{f(depositUSD)} in USD</p>
					</div>
				</div>
				<div class="h-72">
					<CalculatorBars
						borrowed={borrowAmount}
						ethRemaining={ethRemainingIfUserHadSold}
						ethIfYouSold={ethValueIfUserHadSold}
					/>
					<div />
				</div>
				<div class="bg-background text-xs rounded-xl px-3 py-2 text-center">
					By comparison if you'd have sold {f(borrowAmount)} of ETH initially, you'd have {f(
						ethValueIfUserHadSold
					)} in ETH remaining.
				</div>
			</CardContent>
		</Card>
	</div>
</BaseScreen>
