<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { e, f, stbl, type EthereumAddress, fmt } from '$lib/utils';
	import { CopyIcon, DollarSign, ExternalLink, WalletIcon } from 'lucide-svelte';
	import TopBar from '../dashboard/top-bar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { BLOCK_EXPLORER_URLS, CHAIN_ETH_TYPE } from '$lib/contracts';
	import { toast } from 'svelte-sonner';
	import NetworkNames from '$lib/components/ui/network/network-names.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import WalletDialogies from './wallet-dialogues.svelte';
	import TooltipIcon from '$lib/components/ui/tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '$lib/components/ui/tooltip/tooltips';
	import EthPriceTicker from '$lib/components/charts/eth-price-ticker.svelte';
	import { getSupportedTokensFromCoinGecko, type Token } from '$lib/components/ui/swap/swap';
	import type { AppProvider } from '$stores/account';
	import { USDC__factory as GenericERC20__factory } from '$lib/abis/ts';
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	type TokenAndBalance = Token & { balance: number };

	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let tokenListWithBalances = [] as TokenAndBalance[];
	let showMoreTokens = false;

	let triggers = {
		buy: () => {},
		sell: () => {},
		receive: () => {},
		transfer: () => {},
		withdraw: () => {},
		swap: () => {}
	};

	$: tokenList = [] as TokenAndBalance[];
	$: address = $accountStore.address;
	$: provider = $accountStore.provider;
	$: usdcBalance = $web3Store?.balances['USDC']?.small ?? 0;
	$: ethPrice = $web3Store?.ethPrice?.small ?? 0;
	$: ethBalanceUSD = ethBalance * ethPrice;
	$: totalUSDValue = ethBalanceUSD + usdcBalance;
	$: chainId = $web3Store.chainId ?? 1;
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';
	$: ethBalance = $web3Store?.balances[ethType].small ?? 0;
	$: explorerURL = BLOCK_EXPLORER_URLS[chainId] + '/address/' + address;

	$: {
		if (chainId && tokenList.length === 0 && provider && address) {
			setTimeout(() => {
				getSupportedTokensFromCoinGecko(chainId).then((tokens) => {
					fetchTokenBalances(tokens.out.list).then((tokensWithBalances) => {
						const filteredAndSorted = tokensWithBalances
							.filter((token) => token.balance > 0)
							.sort((a, b) => b.balance - a.balance);

						tokenListWithBalances = [...filteredAndSorted];
					});
				});
			}, 0);
		}
	}

	async function fetchTokenBalances(ls: Token[]): Promise<TokenAndBalance[] | []> {
		if (ls.length > 0 && provider && address) {
			const promises = ls.map((token) => fetchSingleTokenBalance(token, provider!, address!));
			return await Promise.all(promises);
		} else {
			return [];
		}
	}

	async function fetchSingleTokenBalance(
		token: Token,
		provider: AppProvider,
		address: EthereumAddress
	): Promise<TokenAndBalance> {
		const contract = GenericERC20__factory.connect(token.address, provider);
		const balance = await contract.balanceOf(address);
		const balanceSmall = ethers.utils.formatUnits(balance, token.decimals);
		return {
			...token,
			balance: Number(balanceSmall)
		};
	}

	function handleCopy() {
		if (address) {
			toast.success('Copied to clipboard');
			navigator.clipboard.writeText(address);
		} else {
			toast.error('Error copying address');
		}
	}
</script>

<!-- <Faq /> -->
<WalletDialogies bind:triggers />
<TopBar page="Wallet">
	<button class="rounded-2xl bg-card-foreground opacity-80 text-xs px-2 py-0">
		<a href={explorerURL} class="w-full flex items-start justify-start gap-1" target="_blank">
			<p>View on Explorer</p>
			<ExternalLink class="h-3 w-3" />
		</a>
	</button>
</TopBar>
<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/wallet.png')]"
	/>
	<div slot="header" class="flex flex-col items-center justify-center gap-2 pb-20" />

	<div slot="card">
		<div class="transform -translate-y-36 flex w-full items-center flex-col gap-4 p-4">
			<!-- Debit Card -->
			<div class="flex w-80 items-center justify-center text-popover">
				<div
					class="bg-cover w-full bg-center bg-no-repeat rounded-3xl shadow-xl shadow-popover pb-4 pt-2 pl-5 pr-2"
					style="background-image: url('backgrounds/card.png');"
				>
					<div class="flex w-full justify-between items-center gap-2">
						<p class="text-3xl">{f(totalUSDValue)}</p>
						<img src="/Logo-light-transparent.png" alt="Ambos Finance" class="h-16 w-16" />
					</div>
					<p>Your Balance</p>
					<div class="flex w-full items-center justify-between">
						<p class="text-[10px] font-extralight text-popover">{address ?? 'Not Connected'}</p>
						<button class="h-3 w-3 text-muted mr-5" on:click={handleCopy}
							><CopyIcon class="w-full h-full" /></button
						>
					</div>
					<div class="pt-10 flex items-center gap-3 pb-1">
						<Button
							on:click={triggers.receive}
							disabled={!address}
							class="py-0 text-sm h-8 rounded-lg w-1/3">Receive</Button
						>
						<Button
							on:click={triggers.withdraw}
							disabled={!address}
							variant="secondary"
							class="py-0 text-sm h-8 rounded-lg w-1/3">Withdraw</Button
						>
					</div>
				</div>
			</div>
			<div class="flex w-full gap-3">
				<Button
					on:click={triggers.buy}
					class="w-1/3 text-secondary border-secondary"
					variant="outline">Buy w. Fiat</Button
				>
				<Button
					on:click={triggers.sell}
					class="w-1/3 text-secondary border-secondary"
					variant="outline">Sell to Fiat</Button
				>
				<Button
					class="w-1/3 text-secondary border-secondary"
					variant="outline"
					on:click={triggers.swap}>Swap (New)</Button
				>
			</div>
			<Card variant="popover" padding="base" class="flex flex-col w-full gap-4 py-4 text-sm">
				<!-- header -->
				<div class="flex w-full justify-between">
					<div class="flex items-center gap-3">
						<WalletIcon class="text-muted-foreground h-4 w-4" />
						<p class="font-bold">Your Wallet Holdings</p>
					</div>
					<TooltipIcon text={TOOLTIPS.WALLET_HOLDINGS} />
				</div>
				<!-- Eth -->
				<Card class="flex w-full justify-between px-4 py-2 shadow-none">
					<p class="font-bold">Network</p>
					<div class="flex items-center justify-end gap-2">
						<NetworkNames />
						<TooltipIcon text={TOOLTIPS.NETWORK} />
					</div>
				</Card>
				<div class="flex justify-between items-center gap-2">
					<div class="flex items-center gap-2">
						<div class="h-10 w-10 bg-background rounded-full flex items-center justify-center">
							<img class="h-8 w-8" src="/external/eth.png" alt="ETH" />
						</div>
						<div>
							<p class="font-bold">Ether</p>
							<div class="flex text-xs items-center">
								<EthPriceTicker />
							</div>
						</div>
					</div>
					<div class="flex flex-col items-end">
						<p class="font-bold">{e(ethBalance)} ETH</p>
						<p class="text-sm">{f(ethBalanceUSD)}</p>
					</div>
				</div>
				<Separator />
				{#if showMoreTokens}
					{#each tokenListWithBalances as token}
						{#if token.balance > 0}
							<div class="flex justify-between items-center gap-2">
								<div class="flex items-center gap-2">
									<div
										class="h-10 w-10 bg-background rounded-full flex items-center justify-center"
									>
										<img class="h-8 w-8" src={token.logoURI} alt={token.symbol} />
									</div>
									<div>
										<p class="font-bold">{token.name}</p>
									</div>
								</div>
								<div class="text-end">
									<p class="font-bold">{fmt(token?.balance ?? 0)} {token.symbol}</p>
								</div>
							</div>
						{/if}
					{/each}
				{:else if tokenListWithBalances.length > 0}
					<Button
						variant="ghost"
						class="text-xs text-secondary"
						on:click={() => (showMoreTokens = true)}
						>Show {tokenListWithBalances.length} more {tokenListWithBalances.length === 1
							? 'token'
							: 'tokens'}...</Button
					>
				{/if}
			</Card>
		</div>
	</div>
	<div class="h-32" />
</BaseScreen>
