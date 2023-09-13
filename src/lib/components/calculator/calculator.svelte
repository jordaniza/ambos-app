<script lang="ts">
	import Eth from '$lib/eth.svelte';
	import { f } from '$lib/utils';
	import { onMount } from 'svelte';
	import Card from '../ui/card/card.svelte';
	import Button from '../ui/button/button.svelte';
	import CardHeader from '../ui/card/card-header.svelte';
	import CardTitle from '../ui/card/card-title.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import { Accordion } from 'bits-ui';
	import CardContent from '../ui/card/card-content.svelte';
	import ResultsChart from './results-chart.svelte';

	let ethSupply = 10; // Initial value
	let borrowAmount = 0; // Initial value
	let ethPrice = 0; // Initial or fetched value
	let fetchedAt: Date;
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
	$: depositValue = Math.max(ethSupplyValue - totalFees, 0);
	$: depositQtyAfterFees = ethPrice > 0 ? depositValue / ethPrice : 0;
	$: totalFeePercentage = ethSupplyValue > 0 ? (totalFees / ethSupplyValue) * 100 : 0;
	$: maxBorrow = depositValue / 2;
	$: newEthPrice = ethPrice * (1 + ethPriceChange / 100);
	$: liquidated = liquidationPrice > newEthPrice;
	$: newDepositValue = liquidated ? 0 : depositQtyAfterFees * newEthPrice;
	$: ethRemainingIfUserHadSold = ethSupplyValue - borrowAmount;
	$: ethValueIfUserHadSold = (ethRemainingIfUserHadSold / ethPrice) * newEthPrice;
	$: changeVsSell = newDepositValue - ethSupplyValue - interest;
	$: changeVsSellPercentage = newDepositValue > 0 ? (changeVsSell / ethSupplyValue) * 100 : 0;

	$: {
		if (borrowAmount > maxBorrow) {
			borrowAmount = maxBorrow;
		}
	}

	// More logic here...
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
</script>

<div class="calculator-container p-4 grid grid-cols-1 md:grid-cols-1 gap-3 max-w-6xl mx-auto">
	<Card class="p-4">
		<CardHeader>
			<CardTitle>Ambos Loans Calculator</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="flex items-center gap-2">
				<Eth height="60" width="50" />
				<div class="text-lg">
					<p>ETH Price</p>
					<p class="font-bold">{f(ethPrice)}</p>
					<p class="italic text-base">Fetched: {fetchedAt?.toLocaleTimeString()}</p>
				</div>
			</div>
		</CardContent>
	</Card>

	<section class="flex w-full flex-grow gap-1">
		<Card class="p-4 w-full">
			<div class="w-full px-4 py-6">
				<h2 class="font-bold">Deposit ETH:</h2>
				<div class="text-center mt-4">
					<span id="demo">{ethSupply} ETH ({f(ethPrice * ethSupply)})</span>
				</div>
				<input
					type="range"
					min="0"
					max="30"
					step="0.01"
					bind:value={ethSupply}
					class="slider w-full"
				/>
				<div class="flex justify-center gap-1 my-3">
					{#each [0.1, 1, 5, 10, 100] as depositPreset}
						<Button
							class="w-12 h-7"
							variant="secondary"
							on:click={() => (ethSupply = depositPreset)}>{depositPreset}</Button
						>
					{/each}
				</div>
			</div>
			<Card class="p-4 text-md">
				<Accordion.Root class="w-full items-center text-left">
					{#each [0] as idx}
						<Accordion.Item class="text-left" value={idx.toString()}>
							<Accordion.Trigger class="font-bold text-left w-full">
								<div class="flex justify-between items-center">
									<div>
										<p>Est. Fees & Charges:</p>
										<p class="italic font-normal">(click to expand)</p>
									</div>
									<p>{f(totalFees)} ({totalFeePercentage.toFixed(2)}%)</p>
								</div>
							</Accordion.Trigger>
							<Accordion.Content class=" italic">
								<Separator class="w-full my-2" />
								<div class="flex justify-between mb-2">
									<p class="font-bold">Ambos Fee:</p>
									<p>{f(ambosFeeValue)} ({ambosFeeWhole}%)</p>
								</div>
								<div class="flex justify-between mb-2">
									<p class="font-bold">Est. Network Fees:</p>
									<p>{f(networkFees)}</p>
								</div>
								<div class="flex justify-between mb-2">
									<p class="font-bold">Est. Exchange Fees:</p>
									<p>{f(exchangeFeeValue)} ({exchangeFeesWhole}%)</p>
								</div>
								<p class="italic">Fees are indicative and for illustrative purposes only</p>
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
				<Separator class="w-full my-3" />
				<div class="flex justify-between">
					<p class="font-bold">After Fees & Charges:</p>
					<p>{f(depositValue)} ({depositQtyAfterFees.toFixed(2)} ETH)</p>
				</div>
			</Card>
			<div class="w-full px-4 py-6 mt-10">
				<h2 class="font-bold">Borrow USD:</h2>
				<div class="text-center mt-4">
					<span id="demo">{f(borrowAmount)} / {f(maxBorrow)}</span>
				</div>
				<input
					type="range"
					min="0"
					max={maxBorrow}
					bind:value={borrowAmount}
					class="slider w-full"
				/>

				<div class="flex justify-center gap-1 my-3">
					{#each [10, 20, 30, 40, 50] as borrowPreset}
						<Button
							class="w-12 h-7"
							variant="secondary"
							on:click={() => (borrowAmount = maxBorrow * (borrowPreset / 100) * 2)}
							>{borrowPreset}%</Button
						>
					{/each}
				</div>
			</div>
			<div class="w-full px-4 py-6 mt-5">
				<h2 class="font-bold">ETH Price In 1 Year:</h2>
				<div class="text-center mt-4">
					<span class={ethPriceChange > 0 ? 'text-green-500' : 'text-red-500'}
						>{f(newEthPrice)} ({ethPriceChange}%)
					</span>
				</div>
				<input
					type="range"
					min={-100}
					max="200"
					bind:value={ethPriceChange}
					class="slider w-full"
				/>
				<div class="flex justify-center gap-1 my-3">
					{#each [-25, 25] as change}
						<Button class="w-12 h-7" variant="secondary" on:click={() => (ethPriceChange += change)}
							>{change > 0 ? '+' + change : change}%</Button
						>
					{/each}
				</div>
			</div>
		</Card>
	</section>
	<Card class="p-4">
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
			<div class="border-secondary border-2 rounded-md p-4">
				<p class="text-sm italic mb-1">Interest</p>
				<p class="text-xl">{interestRate * 100}% ({f(borrowAmount * interestRate)})</p>
			</div>
			<div class="border-secondary border-2 rounded-md p-4">
				<p class="text-sm italic mb-1">Min Deposit Value</p>
				<p class="text-xl">{f(minDepositValue)}</p>
			</div>
			<div>
				<div class="border-secondary border-2 rounded-md p-4">
					<p class="text-sm italic mb-1">Liquidation Price</p>
					<p class="text-xl">{f(liquidationPrice ?? 0)} / ETH</p>
				</div>
				<div />
			</div>
		</div></Card
	>

	<Card class="p-4">
		<CardTitle class="text-xl ml-6 my-5">Results</CardTitle>
		<CardContent>
			<section class="flex flex-col gap-2">
				{#if liquidated}
					<p>
						You <span class="font-bold">borrowed {f(borrowAmount)}</span> in USD, but
						<span class="text-red-500">your ETH was liquidated</span>
						to cover lenders
					</p>
					<p>You no longer have to repay your loan, but you cannot claim your deposit back.</p>
				{:else}
					<p>
						You <span class="font-bold">borrowed {f(borrowAmount)}</span> in USD and
						<span class="text-green-500"> you have {f(newDepositValue)}</span> in ETH deposits
					</p>

					<p>
						Including fees and interest, you're
						{changeVsSell < 0 ? 'down' : 'up'}
						<span class={changeVsSell < 0 ? 'text-red-500' : 'text-green-500'}>
							{f(changeVsSell)} ({changeVsSellPercentage.toFixed(2)}%)</span
						>
					</p>
				{/if}

				<div>
					<p>
						For comparison, if you'd have sold {f(borrowAmount)} of ETH initially you would {changeVsSell <
						0
							? ''
							: 'only'} have {f(ethValueIfUserHadSold)}
						in ETH remaining
					</p>
				</div>
			</section>
			<ResultsChart
				borrowed={borrowAmount}
				ethRemaining={newDepositValue}
				ethIfYouSold={ethValueIfUserHadSold}
			/>
		</CardContent>
	</Card>
</div>

<style>
	/* Tailwind base reset styles */
	.slider {
		appearance: none;
		width: 100%;
		height: 8px;
		border-radius: 5px;
		background: hsl(217, 91%, 60%);
		outline: none;
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	.slider:hover {
		opacity: 1;
	}

	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: hsl(210, 40%, 98%);
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: hsl(222.2, 84%, 4.9%);
		cursor: pointer;
	}
</style>
