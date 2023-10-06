<script lang="ts">
	import Eth from '$lib/eth.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import LoanStepper from '$lib/components/ui/stepper/loanStepper.svelte';
	import { ROUTES } from '$lib/constants';
	import { BN, e, f, getLiquidationPrice, pc } from '$lib/utils';
	import InputEditSlider from './input-edit-slider.svelte';
	import { InfoIcon } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { getEthValue, getFeesAndCharges, getMaxBorrow } from '../../calculator/calculator';
	import * as Accordion from '$lib/components/ui/accordion';
	import { onMount } from 'svelte';
	import {
		setBorrowUsd,
		setIncreaseDebtBuilderStage,
		setSupplyEth
	} from '$stores/transactions/builders';
	import { getCashNow } from '$stores/transactions/batchActions';
	import { ethers } from 'ethers';
	import { InterestRateMode } from '$stores/web3/getPoolData';
	import {
		getLatestTransactionOfType,
		TX_STATES_SUMMARY,
		type TXState
	} from '$stores/transactions/state';
	import { toast } from 'svelte-sonner';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import Success from './success.svelte';

	let web3Store = getWeb3Store();
	let txStore = getTxStore();
	let accountStore = getAccountStore();

	let ethSupply = $txStore.builders.INCREASE_DEBT.ethToSupply ?? 0;
	let borrowAmount = $txStore.builders.INCREASE_DEBT.usdToBorrow ?? 0;
	let isPending = false;

	$: ethBalance = $web3Store.balances.WETH.small ?? 0;
	$: ethPrice = $web3Store.ethPrice.small ?? 0;

	$: depositValueUSD = getEthValue(ethSupply, ethPrice);
	$: maxBorrow = getMaxBorrow(ethSupply, ethPrice);

	$: maxLTV = $web3Store.poolReserveData.ltv.small ?? 0;
	$: liquidationPrice = getLiquidationPrice(borrowAmount, ethSupply, maxLTV);
	$: feesAndCharges = getFeesAndCharges(depositValueUSD, borrowAmount);

	$: transaction = getLatestTransactionOfType($txStore, 'INCREASE_DEBT');
	$: state = transaction?.state;
	$: seen = transaction?.seen;
	$: showSuccessModal = state === 'SUCCESSFUL' && !seen;

	$: if (state !== undefined) {
		// update the notification
		const [message, showToast, typeToast] = updateMessage(state, seen);
		if (message && showToast) {
			switch (typeToast) {
				case 'error':
					toast.error(message);
					break;
				case 'success':
					toast.success(message);
					break;
				case 'pending':
					toast.info(message);
					break;
				default:
					toast(message);
					break;
			}
		}

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

	onMount(() => {
		setIncreaseDebtBuilderStage(txStore, 'review');
	});

	function updateMessage(state: TXState, seen: boolean | undefined): [string, boolean, string] {
		if (seen) return ['', false, ''];
		switch (state) {
			case 'STARTED':
				return ['Started a new loan.', false, 'pending'];
			case 'SIGNING':
				return ['Awaiting Signature', true, 'pending'];
			case 'SIGNED':
				return ['Loan submitted, your loan is being processed', true, 'success'];
			case 'FAILED':
				return ['There was a problem processing your loan.', true, 'error'];
			case 'REJECTED':
				return ['Your loan application was rejected', true, 'error'];
			case 'SUCCESSFUL':
				return ['Success! Your loan has been processed successfully.', true, 'success'];
			default:
				return ['', false, ''];
		}
	}

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
		getCashNow(
			txStore,
			address,
			BN(ethSupply),
			// usdc
			ethers.utils.parseUnits(borrowAmount.toFixed(6), 6),
			InterestRateMode.VARIABLE_IR,
			provider,
			smartAccount
		);
	}
</script>

<Success {borrowAmount} open={showSuccessModal} finalTxHash={transaction?.finalTxHash ?? ''} />
<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans.png')]"
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
					<InfoIcon class="h-4 text-muted-foreground" />
				</div>
			</div>
			<!-- Fees and Charges -->
			<Accordion.Root class="flex w-full text-xs justify-between bg-background rounded-2xl px-3">
				<Accordion.Item value="item-1" class="w-full">
					<Accordion.Trigger class="w-full py-2">
						<div class="font-bold">Est. Fees & Charges</div>
						<div slot="trigger-right">
							{f(feesAndCharges.total)}
							<span class="pl-1 text-muted-foreground">{pc(feesAndCharges.percentOfBorrowed)}</span>
						</div>
					</Accordion.Trigger>
					<Accordion.Content>
						<div class="pt-1 text-xs">
							<div class="flex w-full justify-between">
								<p>Ambos Fee</p>
								<div>
									<p>{f(feesAndCharges.ambosFee)}</p>
								</div>
							</div>
							<div class="flex w-full justify-between">
								<p>Est. Exchange Fees</p>
								<div>
									<p>{f(feesAndCharges.exchangeFee)}</p>
								</div>
							</div>
							<div class="flex w-full justify-between">
								<p>Est. Network Fees</p>
								<div>
									<p>{f(feesAndCharges.networkFee)}</p>
								</div>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
			<!-- {#if notEnoughETH}<p class="text-destructive w-full text-center">Not enough ETH</p>{/if} -->
			<Button on:click={handleSubmit} class="w-full py-5">
				{#if isPending}
					<LoadingSpinner class="text-popover animate-spin" />
				{:else}
					Confirm & Get Loan
				{/if}
			</Button>
			<Button variant="link">Repayment Terms</Button>
		</Card>
	</div>
</BaseScreen>
