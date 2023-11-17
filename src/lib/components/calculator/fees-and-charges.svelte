<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { f, pc, e } from '$lib/utils';
	import { LOCAL_STORAGE_KEYS } from '$lib/constants';
	import { getAmbosFee } from '$lib/components/calculator/calculator';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { getBorrowFeeQuote } from '$stores/transactions/fees';
	import type { BiconomySmartAccount } from '@biconomy/account';
	import type { AppProvider } from '$stores/account';
	import { cacheFetch } from '$lib/cache';
	import { CHAIN_ETH_TYPE } from '$lib/contracts';

	export let borrowAmountUSD: number;
	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let estimatedNetworkFee = 0.01;

	// Computed values
	$: chainId = $web3Store.chainId ?? 1;
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';
	$: ambosFee = getAmbosFee(borrowAmountUSD);
	$: totalFees = ambosFee + estimatedNetworkFee;
	$: feePercent = borrowAmountUSD === 0 ? 0 : (totalFees / borrowAmountUSD) * 100;
	$: smartAccount = $accountStore.smartAccount;
	$: provider = $accountStore.provider;
	$: ethPrice = $web3Store.ethPrice.small ?? 0;

	$: estimatedFeeEth = ethPrice > 0 ? e(estimatedNetworkFee / ethPrice) : 0;

	$: {
		if (smartAccount && provider) {
			tryQuoteFromCache(smartAccount, provider);
		}
	}

	async function tryQuoteFromCache(smartAccount: BiconomySmartAccount, provider: AppProvider) {
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
</script>

<!-- Fees and Charges -->
<Accordion.Root class="flex w-full justify-between bg-background rounded-2xl px-3 py-2 text-xs">
	<Accordion.Item value="item-1" class="w-full">
		<Accordion.Trigger class="w-full">
			<div class="font-bold">Est. Fees & Charges</div>
			<div slot="trigger-right">
				{f(totalFees ?? 0)}
				<span class="pl-1 text-muted-foreground">{pc(feePercent)}</span>
			</div>
		</Accordion.Trigger>
		<Accordion.Content>
			<div class="pt-2 text-xs">
				<div class="flex w-full justify-between">
					<p>Ambos Fee</p>
					<div>
						<p>{f(ambosFee)}</p>
					</div>
				</div>
				<div class="flex w-full justify-between">
					<p>Est. Network Fees</p>
					<div>
						<p>
							{f(estimatedNetworkFee)}
							{#if ethType === 'ETH'} / {estimatedFeeEth} ETH {/if}
						</p>
					</div>
				</div>
			</div>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
