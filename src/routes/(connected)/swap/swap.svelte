<!-- Basic swap component -->

<script lang="ts">
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { f, objToQsp, type EthereumAddress, pc } from '$lib/utils';
	import { ethers } from 'ethers';
	import { onDestroy, onMount } from 'svelte';
	import Input from '$lib/components/ui/swap/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import { getTxStore } from '$lib/context/getStores';
	import { type Token, getSupportedTokensFromCoinGecko } from '$lib/components/ui/swap/swap';
	import type { Nullable } from 'vitest';
	import { ADDRESSES, SWAP_URL, SupportedSwapTokens, TOKEN_LIST_URL } from '$lib/contracts';
	import type { ChainId } from '@biconomy/core-types';
	import { browser } from '$app/environment';
	import { USDC__factory } from '$lib/abis/ts';
	import { env } from '$env/dynamic/public';
	import type { FinalQuote, PriceQuote } from './quote';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { X } from 'lucide-svelte';
	import { makeTxId } from '$stores/transactions/state';
	import { approveERC20Token, swapToken } from '$stores/transactions/actions';
	import Card from '$lib/components/ui/card/card.svelte';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import { getApproveFeeQuote, getFinalSwapFeeQuote } from '$stores/transactions/fees';
	import mockQuote from './quote.json';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import { PUBLIC_ENV } from '$env/static/public';

	const supportIn = SupportedSwapTokens.in;
	const supportOut = SupportedSwapTokens.out;

	// variables
	let showModal = false;

	let web3Store = getWeb3Store();
	let txStore = getTxStore();
	let accountStore = getAccountStore();

	let outTokens: Token[] = [];
	let outToken: Token | null = null;
	let outTokenQty = 0;
	let lastOutToken: Token | null = null;

	let inTokens: Token[] = [];
	let inToken: Token | null = null;
	// todo: support multiple intokens
	let inTokenQty = 0;
	let lastInTokenQty = 0;
	let lastInToken: Token | null = null;
	let inTokenApproval = 0;
	let inTokenApprovalLoading = false;

	let priceQuote: Nullable<PriceQuote> = null;
	let finalQuote: Nullable<FinalQuote> = null;
	let quoting = false;
	let lastUpdatedSecondsAgo: null | number = null;
	let lastQuoteTime = 0;

	let zeroExApiKey: null | string = null;
	let swapRouterAddress: null | EthereumAddress = null;

	let quoteInterval: NodeJS.Timeout;
	let approveTx: string;
	let approving = false;
	let swapping = false;
	let approveFeeEstimate = 0;
	let swapFeeEstimate = 0;

	// Computed values

	$: address = $accountStore.address;
	$: chainId = $web3Store.chainId ?? (1 as ChainId);
	// we only support the USDC token for now as an intoken
	$: inTokenBalance = $web3Store.balances.USDC.small ?? 0;
	$: smartAccount = $accountStore.smartAccount;
	$: provider = $accountStore.provider;
	$: swapRouterAddress = ADDRESSES[chainId]?.SWAP_ROUTER ?? null;
	$: needsApproval = !priceQuote || inTokenApproval < inTokenQty;

	$: buyAmountSmall = finalQuote?.buyAmount
		? NBN(finalQuote.buyAmount, outToken?.decimals ?? 18)
		: 0;
	$: sellAmountSmall = finalQuote?.sellAmount
		? NBN(finalQuote.sellAmount, inToken?.decimals ?? 18)
		: 0;

	// watchers

	$: {
		if (inTokenQty > inTokenBalance) {
			inTokenQty = inTokenBalance;
		}
	}

	$: {
		if (chainId && inTokens.length === 0 && browser) {
			initSwaps();
		}
	}

	$: {
		if (
			inToken &&
			provider &&
			swapRouterAddress &&
			address &&
			smartAccount &&
			lastInToken !== inToken
		) {
			lastInToken = inToken;
			fetchERC20Approval();
			getApproveFeeQuote({
				provider,
				smartAccount,
				token: inToken.address as EthereumAddress,
				spender: swapRouterAddress
			}).then((feeQuote) => {
				approveFeeEstimate = feeQuote.small ?? 0;
			});
		}
	}

	$: {
		if (outToken !== lastOutToken) {
			priceQuote = null;
			outTokenQty = 0;
		}
	}

	$: {
		if ($txStore.transactions[approveTx]?.state === 'SUCCESSFUL') {
			fetchERC20Approval();
		}
	}

	$: {
		if (finalQuote && smartAccount) {
			getFinalSwapFeeQuote({ smartAccount, quote: finalQuote }).then((feeQuote) => {
				console.log(feeQuote);
				swapFeeEstimate = feeQuote.small ?? 0;
			});
		}
	}

	// functions

	const NBN = (q: string, d: number): number => Number(ethers.utils.formatUnits(q, d));

	async function fetchERC20Approval() {
		if (!inToken?.address || !provider || !swapRouterAddress || !address) return;
		try {
			inTokenApprovalLoading = true;
			const erc20 = USDC__factory.connect(inToken.address, provider);
			const allowance = await erc20.allowance(address, swapRouterAddress);
			inTokenApproval = Number(ethers.utils.formatUnits(allowance, inToken.decimals));
		} catch (e) {
			console.warn('In Token is fetched from mainnet, this may have caused an error');
			console.error('Error fetching ERC20 approval', e);
		} finally {
			inTokenApprovalLoading = false;
		}
	}

	async function initSwaps() {
		const supported = await getSupportedTokensFromCoinGecko(chainId);
		inTokens = supported.in.list;
		outTokens = supported.out.list;
		inToken = supported.in.default;
		outToken = supported.out.default;
	}

	quoteInterval = setInterval(() => {
		// dont quote zeroes
		let positiveSwap = inTokenQty > 0;

		// dont quote if the token hasnt changed
		let newTokenInQty = inTokenQty !== lastInTokenQty;
		let newTokenOut = outToken !== lastOutToken;

		// dont quote if the last quote was less than 10 seconds ago
		let quoteExpired = lastQuoteTime && Date.now() - lastQuoteTime > 10_000;

		let newTokenAndPositive = newTokenOut && positiveSwap;
		let newTokenInQtyAndPositive = newTokenInQty && positiveSwap;

		if (
			(newTokenAndPositive || newTokenInQtyAndPositive || quoteExpired) &&
			!quoting &&
			positiveSwap
		) {
			fetchQuote(QuoteType.Price);
			lastInTokenQty = inTokenQty;
			lastOutToken = outToken;
			lastQuoteTime = Date.now();
		}

		if (lastQuoteTime) lastUpdatedSecondsAgo = Math.floor((Date.now() - lastQuoteTime) / 1000);
	}, 1_000);

	// price is just an API call, quote is final
	enum QuoteType {
		Price = 'price',
		Final = 'quote'
	}
	async function fetchQuote(priceOrFinal: QuoteType = QuoteType.Price) {
		if (!inToken || !outToken || quoting || !zeroExApiKey) return;
		quoting = true;
		const sellAmount = ethers.utils.parseUnits(inTokenQty.toString(), inToken.decimals);
		try {
			const params = {
				sellToken: inToken.address,
				buyToken: outToken.address,
				sellAmount,
				takerAddress: address
			};

			const headers = { '0x-api-key': zeroExApiKey };

			const response = await fetch(
				`${SWAP_URL[chainId]}/swap/v1/${priceOrFinal}?${objToQsp(params)}`,
				{
					headers
				}
			);

			const status = response.status;
			if (status !== 200) {
				throw new Error(`Error fetching quote. Status: ${status} ${response}`);
			}

			const quote = await response.json();

			if (priceOrFinal === QuoteType.Final) {
				finalQuote = quote as FinalQuote;
			} else {
				priceQuote = quote as PriceQuote;
			}

			outTokenQty = Number(ethers.utils.formatUnits(quote.buyAmount, outToken.decimals));
		} catch (e) {
			console.error(e);
		} finally {
			quoting = false;
		}
	}

	async function handleERC20Approval() {
		if (!inToken?.address || !provider || !swapRouterAddress || !address || !smartAccount) return;

		try {
			approving = true;
			approveTx = makeTxId();
			console.warn('Approve is using paymaster');
			const tokenAddress = ADDRESSES[chainId].USDC;
			await approveERC20Token({
				id: approveTx,
				store: txStore,
				smartAccount: smartAccount,
				provider: provider,
				token: tokenAddress,
				spender: swapRouterAddress as EthereumAddress,
				decimals: inToken.decimals,
				amount: ethers.constants.MaxUint256,
				usePaymaster: true,
				address
			});
		} catch (e) {
			console.error('Error approving token', e);
		} finally {
			approving = false;
		}
	}

	async function handleConfirmSwap() {
		showModal = true;
		if (PUBLIC_ENV === 'development') {
			finalQuote = mockQuote as any;
		} else {
			await fetchQuote(QuoteType.Final);
		}
	}

	async function handleSwap() {
		if (PUBLIC_ENV === 'development') {
			alert('Swap is disabled in development mode');
			return;
		}
		if (!finalQuote || !txStore || !smartAccount || !inToken || !outToken || !provider) return;
		try {
			swapping = true;
			const id = makeTxId();
			console.warn('Swap is using paymaster');
			await swapToken({
				store: txStore,
				smartAccount,
				quote: finalQuote,
				id,
				provider,
				usePaymaster: true,
				outToken,
				inToken
			});
			inTokenQty = 0;
			outTokenQty = 0;
			showModal = false;
		} catch (e) {
			console.error('Error swapping token', e);
		} finally {
			swapping = false;
		}
	}

	onMount(async () => {
		zeroExApiKey = env.PUBLIC_0X_API_KEY;
		if (!zeroExApiKey) {
			throw new Error('0x API key not found');
		}
	});

	onDestroy(() => {
		clearInterval(quoteInterval);
	});
</script>

<AlertDialog.Root open={showModal}>
	<AlertDialog.Content class="bg-popover">
		<button class="absolute top-2 right-2" on:click={() => (showModal = false)}><X /></button>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm Swap</AlertDialog.Title>
			<AlertDialog.Description />
			{#if finalQuote}
				<div class="w-full flex flex-col items-center p-2 rounded-xl bg-popover text-sm gap-1">
					<div class="flex justify-between w-full items-center text-sm">
						<p class="font-bold">Sell</p>
						<p class="flex items-center gap-1">
							{f(sellAmountSmall)}
							{inToken?.symbol}
							<img src={inToken?.logoURI} alt={inToken?.symbol} class="h-5 w-5 inline-block" />
						</p>
					</div>
					<div class="flex justify-between w-full items-center text-sm">
						<p class="font-bold">Buy</p>
						<p class="flex items-center gap-1">
							{buyAmountSmall.toFixed(6)}
							{outToken?.symbol}
							<img src={outToken?.logoURI} alt={outToken?.symbol} class="h-5 w-5 inline-block" />
						</p>
					</div>
					<div class="flex justify-between w-full items-center text-sm">
						<p class="font-bold">Price</p>
						<p>
							{Number(finalQuote['guaranteedPrice']).toFixed(6)}
							{outToken?.symbol}/{inToken?.symbol}
						</p>
					</div>
					<div class="flex justify-between w-full items-center text-sm">
						<p class="font-bold">Est. Slippage</p>
						<p />
						<p>{pc(Number(finalQuote['estimatedPriceImpact']) ?? 0)}</p>
					</div>
					<div class="flex justify-between w-full items-center text-sm">
						<p class="font-bold">Swap Fees</p>
						<p>{finalQuote['fees'].zeroExFee ? '0.15%' : '0%'}</p>
					</div>
					<div class="flex justify-between w-full items-center text-sm">
						<p class="font-bold">Est. Gas Fees</p>
						<p>{swapFeeEstimate ? f(swapFeeEstimate) : 'Estimating...'}</p>
					</div>
				</div>
			{:else}
				<div>
					<p>Preparing Final Quote...</p>
				</div>
			{/if}
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<Button disabled={swapping || !finalQuote} class="w-full" on:click={handleSwap}>
				{#if swapping}
					<LoadingSpinner />
				{:else}
					Swap
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<!-- USD Borrow -->
<div>
	<InputEditSlider
		title={`How much ${inToken?.symbol ?? 'USDC'} do you want to swap?`}
		showRange={true}
		max={inTokenBalance}
		showMax={true}
		maxFormatter={f}
		step={0.01}
		bind:value={inTokenQty}
		formatter={() => f(inTokenQty)}
	/>

	<section class="flex flex-col gap-3 py-2">
		{#if outToken}
			<p class="font-bold text-start text-sm">What token do you want to swap to?</p>
			<div>
				<div class="flex items-center w-full gap-2">
					<p class="font-bold gap-2" />
					<Input
						tokens={outTokens}
						readonly={true}
						bind:token={outToken}
						tokenQty={Number(outTokenQty)}
					/>
				</div>
				<div class="flex justify-between items-center px-2">
					<p class={`text-center text-xs ` + (quoting ? 'text-secondary' : 'opacity-0')}>
						Quoting...
					</p>
					<p
						class={`italic text-xs  + ${
							lastUpdatedSecondsAgo !== null ? ' text-muted-foreground' : ' opacity-0'
						}`}
					>
						Last updated: {lastUpdatedSecondsAgo} seconds ago
					</p>
				</div>
			</div>
			{#if needsApproval}
				<Card variant="default" padding="base" class="text-xs flex justify-between shadow-none">
					<p>Estimated Approval Fee</p>
					<div class="flex items-center gap-1">
						<p>{f(approveFeeEstimate)}</p>
						<TooltipIcon text={TOOLTIPS.GAS_FEES_ERC20} />
					</div>
				</Card>
			{/if}
			{#if needsApproval}
				<Button disabled={!priceQuote || approving || swapping} on:click={handleERC20Approval}>
					{approving ? 'Approving...' : 'Approve'}
				</Button>
			{:else}
				<Button disabled={!priceQuote} on:click={handleConfirmSwap}>Swap</Button>
			{/if}
		{/if}
	</section>
</div>