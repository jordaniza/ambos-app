<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { f, pc } from '$lib/utils';
	import { LOCAL_STORAGE_KEYS } from '$lib/constants';
	import { getAmbosFee, getNewEthPrice } from '$lib/components/calculator/calculator';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { getBorrowFeeQuote } from '$stores/transactions/fees';
	import type { BiconomySmartAccount } from '@biconomy/account';
	import type { AppProvider } from '$stores/account';
	import { cacheFetch } from '$lib/cache';

	let borrowAmountUSD = 1000;
	let ethPriceChangeWholePc = 20; // Initial value
	let newEthPrice = 0;
	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();
	let estimatedNetworkFee = 0.01;

	// Computed values
	$: ethPrice = $web3Store.ethPrice.small ?? 0;
	$: ambosFee = getAmbosFee(borrowAmountUSD);
	$: newEthPrice = getNewEthPrice(ethPrice, ethPriceChangeWholePc);
	$: totalFees = ambosFee + estimatedNetworkFee;
	$: feePercent = (totalFees / borrowAmountUSD) * 100;
	$: smartAccount = $accountStore.smartAccount;
	$: provider = $accountStore.provider;

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
				{f(ambosFee + estimatedNetworkFee)}
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
						<p>{f(estimatedNetworkFee)}</p>
					</div>
				</div>
			</div>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
