<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import Swap from '../../swap/swap.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { EthereumAddress } from '$lib/utils';
	import { ArrowLeftRightIcon } from 'lucide-svelte';
	import { ethers } from 'ethers';
	import type { AppProvider } from '$stores/account';
	import type { TSupportedSwapTokensIn } from '$lib/contracts';
	import { getSupportedTokensFromCoinGecko, type Token } from '$lib/components/ui/swap/swap';
	import { USDC__factory as GenericERC20__factory } from '$lib/abis/ts';
	import { toast } from 'svelte-sonner';

	export const trigger = () => {
		open = true;
	};
	export let open = false;

	type TokenAndBalance = Token & { balance: number };

	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();
	let openSwap = false;
	let tokenListWithBalances = [] as TokenAndBalance[];
	let selectedTokenSymbol: TSupportedSwapTokensIn;

	$: tokenList = [] as TokenAndBalance[];
	$: address = $accountStore.address;
	$: chainId = $web3Store.chainId ?? 1;
	$: provider = $accountStore.provider;

	$: {
		if (chainId && tokenList.length === 0 && provider && address) {
			getSupportedTokensFromCoinGecko(chainId).then((tokens) => {
				const tokenList = tokens.out.list;
				fetchTokenBalances(tokenList).then((tokensWithBalances) => {
					const filteredTokens = tokensWithBalances
						.filter((token) => token.balance > 0)
						.sort((a, b) => b.balance - a.balance);
					tokenListWithBalances = [...filteredTokens];
				});
			});
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

	async function fetchTokenBalances(ls: Token[]): Promise<TokenAndBalance[] | []> {
		if (ls.length > 0 && provider && address) {
			const promises = ls.map((token) => fetchSingleTokenBalance(token, provider!, address!));
			return await Promise.all(promises);
		} else {
			return [];
		}
	}

	function handleClick(symbol: string) {
		const found = tokenListWithBalances.find((token) => token.symbol === symbol);
		if (found) {
			selectedTokenSymbol = found.symbol as TSupportedSwapTokensIn;
			openSwap = true;
		} else {
			toast.error('Error selecting token, please contact support');
		}
	}

	let searchValue = '';
	$: filteredTokens = tokenListWithBalances.filter((token) => {
		return (
			token.name.toLowerCase().includes(searchValue.toLowerCase()) ||
			token.symbol.toLowerCase().includes(searchValue.toLowerCase())
		);
	});
</script>

<!-- Select currency -->
<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Swap</Dialog.Title>
		<div>
			<!-- A search bar -->
			<input
				type="text"
				placeholder="Search"
				bind:value={searchValue}
				class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
			/>
		</div>
		<div class="flex flex-col gap-3 overflow-scroll max-h-[500px]">
			{#each filteredTokens as token}
				<!-- {#if token.balance > 0} -->
				<button class="w-full" on:click={() => handleClick(token.symbol)}>
					<Card padding="base" class="shadow-none rounded-xl text-sm">
						<div class="flex justify-between items-center gap-2">
							<div class="flex items-center gap-2">
								<div class="h-10 w-10 flex items-center justify-center">
									<img class="h-6 w-6" src={token.logoURI} alt={token.symbol} />
								</div>
								<div>
									<p class="font-bold">{token.name}</p>
								</div>
							</div>
							<div class="text-end">
								<p class="font-bold">{token?.balance.toFixed(6) ?? 0} {token.symbol}</p>
							</div>
						</div>
					</Card>
				</button>
				<!-- {/if} -->
			{/each}
		</div></Dialog.FlyInContent
	>
</Dialog.Root>

<!-- Transfer -->
<Dialog.Root bind:open={openSwap}>
	<Dialog.FlyInContent class="bg-popover">
		<Card
			variant="popover"
			padding="base"
			class="flex flex-col w-full gap-4 py-4 text-sm shadow-none"
		>
			<div class="flex w-full justify-between">
				<div class="flex items-center gap-3">
					<ArrowLeftRightIcon class="text-muted-foreground h-4 w-4" />
					<p class="font-bold">Swap Tokens</p>
					<p />
				</div>
			</div>
			<Swap preferredInTokenSymbol={selectedTokenSymbol} />
		</Card>
	</Dialog.FlyInContent>
</Dialog.Root>
