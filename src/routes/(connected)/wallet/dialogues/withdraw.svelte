<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import * as Dialog from '$lib/components/ui/dialog';
	import { e, f, type EthereumAddress } from '$lib/utils';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import NetworkLogos from '$lib/components/ui/network/network-logos.svelte';
	import NetworkNames from '$lib/components/ui/network/network-names.svelte';
	import { ScanLineIcon } from 'lucide-svelte';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import EthWalletCard from '$lib/components/wallet-cards/eth-wallet-card.svelte';
	import UsdcWalletCard from '$lib/components/wallet-cards/usdc-wallet-card.svelte';
	import EthAddressInput from '$lib/components/ui/input/ethAddressInput.svelte';
	import { sendETH, sendUSDC, sendWETH } from '$stores/transactions/actions';
	import { ethers } from 'ethers';
	import { TX_STATES_SUMMARY, makeTxId } from '$stores/transactions/state';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import { LOCAL_STORAGE_KEYS } from '$lib/constants';
	import type { BiconomySmartAccount } from '@biconomy/account';
	import type { AppProvider } from '$stores/account';
	import { getTransferFeeQuote } from '$stores/transactions/fees';
	import { cacheFetch } from '$lib/cache';
	import { CHAIN_ETH_TYPE } from '$lib/contracts';

	export const trigger = () => {
		open = true;
	};

	export let open = false;
	export let currency: 'ETH' | 'USDC' = 'ETH';

	let web3Store = getWeb3Store();
	let txStore = getTxStore();
	let accountStore = getAccountStore();

	let txId: string;
	let checked: boolean = false;
	let openWithdraw = false;
	let withdrawQty = 0;
	let sendAddress = '0x....';
	let inputValid: boolean;
	let isPending = false;
	let estimatedNetworkFee = 0.01;

	$: chainId = $web3Store.chainId ?? 1;
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';
	$: ethBalance = $web3Store.balances[ethType].small ?? 0;
	$: ethPrice = $web3Store.ethPrice?.small ?? 0;
	$: usdcBalance = $web3Store.balances.USDC.small ?? 0;
	$: withdrawETHUSDValue = withdrawQty * ethPrice;
	$: disabled = !checked || !inputValid;

	$: smartAccount = $accountStore.smartAccount;
	$: provider = $accountStore.provider;
	$: transaction = $txStore.transactions[txId];
	$: state = transaction?.state;

	$: if (state !== undefined) {
		// the state should be loading while pending
		if (TX_STATES_SUMMARY['PENDING'].includes(state)) {
			isPending = true;
		} else {
			isPending = false;
		}
		// depending on the state, reset the form
		if (state === 'SIGNED') {
			sendAddress = '';
			withdrawQty = 0;
		}
	}

	$: {
		if (openWithdraw) {
		}
	}

	function handleClick(chosenCurrency: 'ETH' | 'USDC') {
		currency = chosenCurrency;
		openWithdraw = true;
		open = false;
	}

	function handleWithdraw() {
		if (!smartAccount || !provider || !inputValid) return;

		txId = makeTxId();
		if (currency === 'ETH') {
			if (ethType === 'WETH') {
				sendWETH({
					id: txId,
					store: txStore,
					smartAccount: smartAccount,
					provider: provider,
					recipient: sendAddress as EthereumAddress,
					amount: ethers.utils.parseEther(withdrawQty.toString())
				});
			} else if (ethType === 'ETH') {
				sendETH({
					id: txId,
					store: txStore,
					smartAccount: smartAccount,
					provider: provider,
					recipient: sendAddress as EthereumAddress,
					amount: ethers.utils.parseEther(withdrawQty.toString())
				});
			}
		} else if (currency === 'USDC') {
			sendUSDC({
				id: txId,
				store: txStore,
				smartAccount: smartAccount,
				provider: provider,
				recipient: sendAddress as EthereumAddress,
				amount: ethers.utils.parseUnits(withdrawQty.toString(), 6)
			});
		}
	}

	function formatter() {
		if (currency === 'ETH') return `${e(withdrawQty)} ${currency} - ${f(withdrawETHUSDValue)}`;
		else return f(withdrawQty);
	}

	$: {
		if (smartAccount && provider) {
			tryQuoteFromCache(smartAccount, provider);
		}
	}

	async function tryQuoteFromCache(smartAccount: BiconomySmartAccount, provider: AppProvider) {
		const key = LOCAL_STORAGE_KEYS.CACHED_FEE_DATA_TRANSFER;
		const expiry = 1 * 30 * 1000; // 30 seconds
		const token = currency === 'ETH' ? ethType : currency;
		const transferQty =
			currency === 'ETH'
				? ethers.utils.parseEther(withdrawQty.toString())
				: ethers.utils.parseUnits(withdrawQty.toString(), 6);

		try {
			estimatedNetworkFee = await cacheFetch(key, expiry, async () => {
				const quote = await getTransferFeeQuote({
					smartAccount,
					provider,
					transferQty,
					token
				});
				return quote.small;
			});
		} catch (e) {
			console.error('Error estimating fees', e);
		}
	}
</script>

<!-- Select currency -->
<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Withdraw</Dialog.Title>
		<div class="flex flex-col gap-3">
			<button
				on:click={() => handleClick('ETH')}
				class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
			>
				<div class="flex items-center gap-2">
					<img src="/external/eth.png" alt="eth" class="h-8 w-8" />
					<p>Ether</p>
				</div>
				<p>ETH</p>
			</button>
			<button
				on:click={() => handleClick('USDC')}
				class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
			>
				<div class="flex items-center gap-2">
					<img src="/external/usdc.png" alt="eth" class="h-8 w-8" />
					<p>USDC</p>
				</div>
				<p>USDC</p>
			</button>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>

<!-- Transfer -->
<Dialog.Root bind:open={openWithdraw}>
	<Dialog.FlyInContent class="bg-popover">
		<div class="flex w-full flex-col gap-3">
			<p class="font-3xl font-extrabold text-center">Withdraw</p>

			<!-- Wallet balance and 'credit card' -->
			{#if currency === 'ETH'}
				<EthWalletCard />
			{:else if currency === 'USDC'}
				<UsdcWalletCard />
			{/if}

			<!-- Select how much -->
			<InputEditSlider
				title={`How much ${currency} do you want to withdraw?`}
				max={currency === 'ETH' ? ethBalance : usdcBalance}
				step={0.01}
				showRange={true}
				bind:value={withdrawQty}
				{formatter}
			/>

			<!-- Network -->
			<Card class="flex justify-between px-3 py-2 text-sm shadow-none">
				<div class="flex items-center">
					<div class="h-8 w-8 bg-popover flex items-center justify-center rounded-full">
						<NetworkLogos class="h-5 w-5" />
					</div>
					<NetworkNames class="pl-2 font-bold" />
				</div>
				<div class="flex items-center justify-end gap-2">
					<p>ETH</p>
					<TooltipIcon text={TOOLTIPS.NETWORK} />
				</div>
			</Card>

			<!-- Send to -->
			<div class="flex flex-col w-full gap-2 mt-1">
				<p class="font-bold">Send to</p>
				<div
					class="border-muted-foreground border-2 rounded-xl p-2 flex items-center justify-between gap-2"
				>
					<EthAddressInput
						class="grow focus:border-0 border-0 outline-none font-mono text-sm"
						bind:value={sendAddress}
						bind:inputValid
					/>
					<ScanLineIcon class="h-5 w-5" />
				</div>
				{#if sendAddress && sendAddress !== '0x....' && !inputValid}
					<p class="w-full text-destructive text-xs text-center">Invalid address</p>
				{/if}
				<Card class="flex justify-between px-3 py-2 text-sm shadow-none">
					<div class="flex items-center justify-end gap-2">
						<p class="font-bold">Transaction Fee</p>
						<TooltipIcon text={TOOLTIPS.TRANSACTION_FEE} />
					</div>
					<div class="flex items-center gap-2">
						<p>{f(estimatedNetworkFee)}</p>
					</div>
				</Card>
			</div>

			<!-- Network Caution -->
			<Card
				class="flex flex-col gap-3 items-center justify-between px-3 py-2 text-sm text-center shadow-none"
			>
				<p class="w-full font-bold text-destructive">Network Caution!</p>
				<p class="w-full">
					Ensure you send to the correct network to avoid irreversible loss of funds!
				</p>
				<div class="flex items-center space-x-2 pb-2">
					<Label
						for="terms"
						class="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						I acknowledge the network details.
					</Label>
					<Checkbox id="terms" bind:checked />
				</div>
			</Card>
			<Button {disabled} class="w-full" on:click={handleWithdraw}>
				{#if isPending}
					<LoadingSpinner class="text-popover animate-spin" />
				{:else}
					Withdraw
				{/if}
			</Button>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
