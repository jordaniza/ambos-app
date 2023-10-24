<script lang="ts">
	import Eth from '$lib/eth.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import LoanStepper from '$lib/components/ui/stepper/loanStepper.svelte';
	import { ROUTES } from '$lib/constants';
	import { BN, e, f, getLiquidationPrice, pc } from '$lib/utils';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import {
		getAmbosFee as getFeesAndCharges,
		getMaxBorrow
	} from '$lib/components/calculator/calculator';
	import { onMount } from 'svelte';
	import {
		setBorrowUsd,
		setIncreaseDebtBuilderStage,
		setSupplyEth
	} from '$stores/transactions/builders';
	import { increaseDebt } from '$stores/transactions/batchActions';
	import { ethers } from 'ethers';
	import { InterestRateMode } from '$stores/web3/getPoolData';
	import { makeTxId, TX_STATES_SUMMARY } from '$stores/transactions/state';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { getBorrowFeeQuote } from '$stores/transactions/fees';
	import FeesAndCharges from '$lib/components/calculator/fees-and-charges.svelte';

	let web3Store = getWeb3Store();
	let txStore = getTxStore();
	let accountStore = getAccountStore();

	let ethSupply = $txStore.builders.INCREASE_DEBT.ethToSupply ?? 0;
	let borrowAmount = $txStore.builders.INCREASE_DEBT.usdToBorrow ?? 0;
	let isPending = false;
	let txId: string;
	let estimatedNetworkFee = 0.01;

	$: ethBalance = $web3Store.balances.WETH.small ?? 0;
	$: ethPrice = $web3Store.ethPrice.small ?? 0;

	$: maxBorrow = getMaxBorrow(ethSupply, ethPrice);

	$: maxLTV = $web3Store.poolReserveData.ltv.small ?? 0;
	$: liquidationPrice = getLiquidationPrice(borrowAmount, ethSupply, maxLTV);
	$: feesAndCharges = getFeesAndCharges(borrowAmount);

	$: transaction = $txStore.transactions[txId];
	$: state = transaction?.state;

	$: smartAccount = $accountStore.smartAccount;
	$: provider = $accountStore.provider;

	$: if (state !== undefined) {
		// the state should be loading while pending
		if (TX_STATES_SUMMARY['PENDING'].includes(state)) {
			isPending = true;
		} else {
			isPending = false;
		}
		// depending on the state, reset the form
		if (state === 'SIGNED') {
			setSupplyEth(txStore, 0);
			setBorrowUsd(txStore, 0);
		}
	}

	$: {
		setSupplyEth(txStore, ethSupply);
	}

	$: {
		setBorrowUsd(txStore, borrowAmount);
	}

	$: {
		if (smartAccount && provider) {
			getBorrowFeeQuote({ smartAccount, provider })
				.then((quote) => {
					estimatedNetworkFee = quote.small;
				})
				.catch((err) => {
					console.log('Error estimating fees', err);
				});
		}
	}

	onMount(() => {
		setIncreaseDebtBuilderStage(txStore, 'review');
	});

	function formatETHValue(value: number, ethPrice: number): string {
		return `${e(value)} ETH - ${f(value * ethPrice)}`;
	}

	function formatBorrowValue(value: number, maxBorrow: number): string {
		return `${f(value)} of ${f(maxBorrow)}`;
	}

	function handleSubmit() {
		const { address, provider, smartAccount } = $accountStore;
		if (!address || !provider || !smartAccount) {
			console.warn('Missing address, provider, or smartAccount');
			return;
		}

		txId = makeTxId();

		increaseDebt({
			id: txId,
			store: txStore,
			borrower: address,
			amountInWeth: BN(ethSupply),
			// usdc
			amountOutUsdc: ethers.utils.parseUnits(borrowAmount.toFixed(6), 6),
			interestRateMode: InterestRateMode.VARIABLE_IR,
			provider,
			smartAccount
		});
	}
</script>

<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans-2.png')]"
	/>
	<div slot="header" class="pb-5">
		<BackButton backTo={ROUTES.DASHBOARD_V2} />
		<div class="pt-5 px-4">
			<h1 class="font-extrabold text-2xl pb-3 tracking-widest">Review Your Loan Details</h1>
			<p>Check all the details and get your loan now</p>
		</div>
	</div>
	<div slot="card" class="p-4 flex flex-col gap-5">
		<LoanStepper />
		<!-- Review Params -->
		<Card class="bg-popover px-4 py-4 flex flex-col gap-4">
			<Card
				class="bg-[url('/backgrounds/card.png')] text-popover rounded-3xl p-6 flex flex-col gap-2"
			>
				<div class="w-full flex justify-between items-center">
					<div class=" rounded-xl">
						<p class="font-extrabold text-lg">ETH</p>
						<p class="text-sm font-extralight text-muted-foreground">Your Ambos Wallet</p>
						<p class="text-2xl">{e(ethBalance)} ETH</p>
					</div>
					<div class="flex flex-col items-end justify-between">
						<div class="h-10 w-10 bg-popover p-2 rounded-full">
							<Eth />
						</div>
					</div>
				</div>
			</Card>
			<InputEditSlider
				title="You Supply"
				bind:value={ethSupply}
				max={ethBalance}
				step={0.01}
				formatter={() => formatETHValue(ethSupply, ethPrice)}
			/>
			<InputEditSlider
				title="Borrowing"
				bind:value={borrowAmount}
				max={maxBorrow}
				step={1}
				formatter={() => formatBorrowValue(borrowAmount, maxBorrow)}
			/>
			<div
				class="bg-background text-xs py-2 rounded-2xl px-4 flex w-full justify-between items-center"
			>
				<p class="font-bold">Liquidation Price</p>
				<div class="flex gap-2 justify-end items-center">
					<p>{f(liquidationPrice)} / ETH</p>
					<TooltipIcon text={TOOLTIPS.LIQUIDATION_PRICE} />
				</div>
			</div>

			<FeesAndCharges />

			<!-- {#if notEnoughETH}<p class="text-destructive w-full text-center">Not enough ETH</p>{/if} -->
			<Button on:click={handleSubmit} class="w-full py-5">
				{#if isPending}
					<LoadingSpinner class="text-popover animate-spin" />
				{:else}
					Confirm & Get Loan
				{/if}
			</Button>
			<!-- <Button variant="link">Repayment Terms</Button> -->
		</Card>
	</div>
</BaseScreen>
