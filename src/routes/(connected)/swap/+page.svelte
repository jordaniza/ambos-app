<script lang="ts">
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { e, f, objToQsp, pc } from '$lib/utils';
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import Input from '$lib/components/ui/swap/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import InputEditSlider from '$lib/components/ui/input/input-edit-slider.svelte';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { LOCAL_STORAGE_KEYS } from '$lib/constants';
	import {
		getEthValue,
		getLiquidationPrice,
		getMaxBorrow,
		getMinimumDepositValue,
		getNewEthPrice
	} from '$lib/components/calculator/calculator';
	import { getTxStore } from '$lib/context/getStores';
	import { getBorrowFeeQuote } from '$stores/transactions/fees';
	import type { BiconomySmartAccountV2 } from '@biconomy/account';
	import type { AppProvider } from '$stores/account';
	import { cacheFetch } from '$lib/cache';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import {
		extractCoinGecko,
		type CoinGeckoAPIResponse,
		type Token
	} from '$lib/components/ui/swap/swap';
	import type { Nullable } from 'vitest';
	import { ADDRESSES, CHAIN_ETH_TYPE } from '$lib/contracts';
	import { ChainId } from '@biconomy/core-types';
	import { browser } from '$app/environment';
	import { USDC__factory } from '$lib/abis/ts';

	let ethSupplyQty = 5;
	let borrowAmountUSD = 1000;
	let ethPriceChangeWholePc = 20; // Initial value
	let newEthPrice = 0;
	let web3Store = getWeb3Store();
	let txStore = getTxStore();
	let accountStore = getAccountStore();
	let estimatedNetworkFee = 0.01;

	let inTokens: Token[] = [];
	let supplyTokens: Token[] = [];
	let outTokens: Token[] = [];
	let andSwap = true;

	let quoting = false;

	const supportIn = {
		list: ['USDC'],
		default: 'USDC'
	};

	const supportSupply = { list: ['WETH'], default: 'WETH' };

	const supportOut = {
		list: ['WBTC', 'WETH', 'LINK', 'UNI', 'AAVE', 'ARB', 'WMATIC', 'USDC'],
		default: 'WETH'
	};

	const OX_API_KEY = 'e37c1d9b-908b-4009-9342-5a05a24572aa';

	let outToken: Token | null = null;
	let outTokenQty = 0;

	let inToken: Token | null = null;
	$: inTokenQty = borrowAmountUSD;

	let supplyToken: Token | null = null;
	let supplyTokenQty = 0;

	type Quote = {
		gas: number;
		gasPrice: number;
		to: string;
		data: string;
		value: number;
		chainId: number;
	};

	let quote: Nullable<Quote> = null;

	// Computed values
	$: address = $accountStore.address;
	$: eoa = $accountStore.eoa;
	$: ethPrice = $web3Store.ethPrice.small ?? 0;
	$: chainId = $web3Store.chainId ?? (1 as ChainId);
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';
	$: ethMaxValue = $web3Store.balances[ethType].small ?? 0;
	$: maxBorrow = getMaxBorrow(ethSupplyQty, ethPrice);
	$: maxLTV = $web3Store.poolReserveData['WETH'].ltv.small ?? 0;
	$: liquidationPrice = getLiquidationPrice(ethSupplyQty, borrowAmountUSD, maxLTV);
	$: minDepositValue = getMinimumDepositValue(liquidationPrice, ethSupplyQty);
	$: depositUSDValue = getEthValue(ethSupplyQty, ethPrice);
	$: newEthPrice = getNewEthPrice(ethPrice, ethPriceChangeWholePc);
	$: smartAccount = $accountStore.smartAccount;
	$: provider = $accountStore.provider;
	$: showDepositWarning = borrowAmountUSD === maxBorrow && ethSupplyQty < ethMaxValue;
	$: savedEthToSupply = $txStore.builders.INCREASE_DEBT.ethToSupply ?? 0;
	$: savedUSDToBorrow = $txStore.builders.INCREASE_DEBT.usdToBorrow ?? 0;
	$: interestRate = ($web3Store.poolReserveData['USDC'].variableBorrowingRate.small ?? 0) * 100;

	$: {
		if (borrowAmountUSD > maxBorrow) {
			borrowAmountUSD = maxBorrow;
		}
	}

	$: {
		if (smartAccount && provider) {
			tryQuoteFromCache(smartAccount, provider);
		}
	}

	$: console.log({ provider });

	async function tryQuoteFromCache(smartAccount: BiconomySmartAccountV2, provider: AppProvider) {
		const key = LOCAL_STORAGE_KEYS.CACHED_FEE_DATA_GET_LOAN;
		const expiry = 5 * 60 * 1000; // 5 minutes
		try {
			estimatedNetworkFee = await cacheFetch(key, expiry, async () => {
				const quote = await getBorrowFeeQuote({ smartAccount, provider });
				return quote.small;
			});
		} catch (e) {
			console.error('Error estimating fees', e);
		}
	}

	const SWAP_URL: Partial<Record<ChainId, string>> = {
		[ChainId.POLYGON_MUMBAI]: 'https://mumbai.api.0x.org',
		[ChainId.ARBITRUM_ONE_MAINNET]: 'https://arbitrum.api.0x.org'
	};

	const TOKEN_LIST_URL: Partial<Record<ChainId, string>> = {
		[ChainId.POLYGON_MUMBAI]: 'https://tokens.coingecko.com/polygon-pos/all.json',
		[ChainId.ARBITRUM_ONE_MAINNET]: 'https://tokens.coingecko.com/arbitrum-one/all.json'
	};

	let eoaUSDCBalance = 0;

	async function getEOABalance() {
		if (!provider || !eoa) return;
		const addresses = ADDRESSES[chainId]!;
		const usdc = USDC__factory.connect(addresses.USDC, provider);
		const ethBalance = await provider.getBalance(eoa);
		const balance = await usdc.balanceOf(eoa);
		console.log({ balance: balance.toNumber() / 1e6 });

		const ethBalanceFormatted = ethers.utils.formatEther(ethBalance);
		const usdcBalanceFormatted = ethers.utils.formatUnits(balance, 6);
		eoaUSDCBalance = Number(usdcBalanceFormatted);
		maxBorrow = eoaUSDCBalance;
	}

	async function initSwaps() {
		const url = TOKEN_LIST_URL[chainId]!;
		const key = url;
		const tokens = localStorage.getItem(key);

		if (!tokens) {
			fetch(url)
				.then((res) => res.json())
				.then((data) => {
					localStorage.setItem(key, JSON.stringify(data));
					console.log(data);
				});
		} else {
			const parsedArray = JSON.parse(tokens) as CoinGeckoAPIResponse;

			const justTokens = extractCoinGecko(parsedArray);

			inTokens = justTokens.filter((token: Token) => supportIn.list.includes(token.symbol));
			supplyTokens = justTokens.filter((token: Token) => supportSupply.list.includes(token.symbol));
			outTokens = justTokens.filter((token: Token) => supportOut.list.includes(token.symbol));

			inToken = inTokens.find((token) => token.symbol === supportIn.default)!;
			supplyToken = supplyTokens.find((token) => token.symbol === supportSupply.default)!;
			outToken = outTokens.find((token) => token.symbol === supportOut.default)!;
		}
	}

	let lastInQty = 0;
	let lastOutToken: Token | null = null;

	setInterval(() => {
		let positiveSwap = inTokenQty > 0;
		let newTokenInQty = inTokenQty !== lastInQty;
		let newTokenOut = outToken !== lastOutToken;

		if ((newTokenOut && positiveSwap) || (andSwap && positiveSwap && !quoting && newTokenInQty)) {
			console.log('updating quote');
			fetchQuote();
			lastInQty = inTokenQty;
			lastOutToken = outToken;
		}
	}, 1_000);

	async function fetchQuote() {
		if (!inToken || !outToken || quoting) return;
		quoting = true;
		const sellAmount = ethers.utils.parseUnits(inTokenQty.toString(), inToken.decimals);
		console.log(sellAmount.toBigInt(), inToken.decimals);
		try {
			console.warn('Warning::Signer is the EOA, not the SCW on the swap');
			const params = {
				sellToken: inToken.address,
				buyToken: outToken.address,
				sellAmount,
				takerAddress: eoa
			};

			const headers = { '0x-api-key': OX_API_KEY };

			// await initSwaps();
			fetch(`${SWAP_URL[chainId]}/swap/v1/sources`, { headers })
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
				});
			const response = await fetch(`${SWAP_URL[chainId]}/swap/v1/price?${objToQsp(params)}`, {
				headers
			});

			const status = response.status;
			if (status !== 200) {
				console.log(response);
				const body = await response.body?.pipeTo(new WritableStream()).then((r) => console.log(r));
				console.log(body);
				throw new Error(`Error fetching quote. Status: ${status} ${response}`);
			}
			quote = await response.json();
			outTokenQty = Number(ethers.utils.formatUnits(quote.buyAmount, outToken.decimals));
		} catch (e) {
			console.error(e);
		} finally {
			quoting = false;
		}
	}

	async function swap() {
		await fetchQuote();
		if (!quote || !provider) return;

		const signer = provider.getSigner();

		console.log({ signer });

		const usdc = USDC__factory.connect(ADDRESSES[chainId]!.USDC, signer);

		console.log({ usdc, addr: ADDRESSES[chainId]!.USDC, quote });

		const txApprove = await usdc.approve(quote.allowanceTarget, ethers.constants.MaxUint256);

		await txApprove.wait();

		// console.log({ quote });
		const tx = await signer.sendTransaction({
			gasLimit: quote.gas,
			gasPrice: quote.gasPrice,
			to: quote.allowanceTarget,
			data: quote.data,
			value: quote.value,
			chainId: quote.chainId
		});

		const receipt = await tx.wait();

		console.log({ receipt, quote });
	}

	$: {
		if (chainId && inTokens.length === 0 && browser) {
			initSwaps();
		}
	}

	onMount(async () => {
		if (savedEthToSupply > 0) {
			ethSupplyQty = savedEthToSupply;
		}
		if (savedUSDToBorrow > 0) {
			borrowAmountUSD = savedUSDToBorrow;
		}
		getEOABalance();
	});
</script>

<div class="p-4 flex flex-col gap-5 pb-20">
	<Card class=" text-center bg-popover">
		<CardContent class="flex flex-col gap-5">
			<!-- <div class=" w-full flex flex-col gap-1 items-center justify-center">
				{#if supplyToken}
					<div class="flex items-center justify-between w-full px-5 bg-popover gap-2">
						<p class="font-bold">Supply</p>
						<Input tokens={supplyTokens} bind:token={supplyToken} bind:tokenQty={supplyTokenQty} />
					</div>
				{/if}
				{#if inToken}
					<div class="flex items-center justify-between w-full px-5 bg-popover gap-2">
						<p class="font-bold">Borrow</p>
						<Input tokens={inTokens} bind:token={inToken} readonly={true} tokenQty={inTokenQty} />
					</div>
				{/if}
				{#if outToken}
					<div class="flex items-center justify-between w-full px-5 bg-popover gap-2">
						<p class="font-bold">Swap</p>
						<Input
							tokens={outTokens}
							readonly={true}
							bind:token={outToken}
							tokenQty={Number(outTokenQty.toFixed(2))}
						/>
					</div>
				{/if}
				<div class="w-full py-1 flex justify-center">
					<Button on:click={handleQuote}
						>{#if quoting}
							<LoadingSpinner />
						{:else}
							Quote
						{/if}
					</Button>
				</div>
			</div> -->

			<!-- Eth Supply -->
			<div class="py-4">
				<InputEditSlider
					title={`How much ${
						supplyToken?.symbol === 'WETH' ? 'ETH' : supplyToken?.symbol ?? 'ETH'
					} do you want to deposit?`}
					max={ethMaxValue}
					showMax={true}
					maxFormatter={(m) => `${e(m)} ETH`}
					showRange={true}
					step={0.01}
					bind:value={ethSupplyQty}
					formatter={() => `${ethSupplyQty} ETH`}
				>
					<div slot="tooltip">
						<TooltipIcon text={TOOLTIPS.ETH_DEPOSIT} />
					</div>
					<div slot="below-input-left" class="text-xs flex justify-between">
						<div class="flex gap-1">
							<p class="font-bold">Value:</p>
							<p>{f(depositUSDValue)}</p>
						</div>
					</div>
				</InputEditSlider>
			</div>

			<!-- USD Borrow -->
			<div>
				<InputEditSlider
					title={`How much ${inToken?.symbol ?? 'USDC'} do you want to borrow?`}
					showRange={true}
					max={eoaUSDCBalance}
					showMax={true}
					maxFormatter={f}
					step={0.01}
					bind:value={borrowAmountUSD}
					formatter={() => f(borrowAmountUSD)}
				>
					<div slot="tooltip">
						<TooltipIcon text={TOOLTIPS.USD_BORROWED} />
					</div>
				</InputEditSlider>

				{#if showDepositWarning}
					<p class="text-xs text-secondary">Increase the ETH deposit if you want to borrow more</p>
				{/if}

				<section class="flex flex-col gap-2 py-2">
					<div class="w-full flex justify-start py-2 items-center gap-1">
						<p>Add Swap?</p>
						<Checkbox bind:checked={andSwap}>Swap</Checkbox>
					</div>
					{#if outToken && andSwap}
						<p class="font-bold text-start text-base">What token do you want to swap to?</p>
						<p class="text-start text-xs">{eoa}</p>
						<div class="flex items-center w-full bg-popover gap-2">
							<p class="font-bold gap-2" />
							<Input
								tokens={outTokens}
								readonly={true}
								bind:token={outToken}
								tokenQty={Number(outTokenQty.toFixed(4))}
							/>
						</div>
						<Button on:click={swap}>Swap</Button>
						{#if quoting}
							<p class="text-xs text-secondary">Quoting...</p>
						{/if}
					{/if}
				</section>
			</div>
			<!-- Stats -->
			<section class="text-xs flex flex-col gap-3">
				<!-- Min Deposit value && interet rate -->
				<div class="flex w-full gap-2">
					<div class="bg-background w-1/2 rounded-2xl px-3 py-2 text-left">
						<p class="font-bold">Min Deposit Value</p>
						<p>{f(minDepositValue)}</p>
					</div>
					<div class="bg-background w-1/2 rounded-2xl px-3 py-2 text-left">
						<p class="font-bold">Interest Rate</p>
						<p>{pc(interestRate ?? 0)}</p>
					</div>
				</div>

				<!-- Liquidation info -->
				<div class="flex w-full justify-between bg-background rounded-2xl px-3 py-2">
					<div class="font-bold">Liquidation Price</div>
					<div class="flex gap-1 text-end">
						<div>{f(liquidationPrice)} / ETH</div>
						<TooltipIcon text={TOOLTIPS.LIQUIDATION_PRICE} />
					</div>
				</div>
			</section>
		</CardContent>
	</Card>
</div>
