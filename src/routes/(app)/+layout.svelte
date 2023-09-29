<script lang="ts">
	import '../../app.postcss';

	import { connect } from '$stores/account';
	import { onMount } from 'svelte';
	import { ChainId } from '@biconomy/core-types';
	import { loadTheme } from '$lib/components/ui/theme-toggle';
	import Toast from './toast.svelte';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { accountStore as _accountStore } from '$stores/account';
	import { setContext } from 'svelte';
	import { web3Store as _web3Store, watchW3Store, refreshW3Store } from '$stores/web3';
	import {
		txStore as _txStore,
		readTransactionsFromLocalStorage,
		writeTransactionsToLocalStorage
	} from '$stores/transactions/state';
	import { ACCOUNT_KEY, TX_KEY, WEB3_KEY } from '$lib/context/getStores';
	import { setChainId } from '$stores/web3/actions';
	import { pwaInfo } from 'virtual:pwa-info';
	import Footer from './footer.svelte';
	import Splash from './splash.svelte';
	import { page } from '$app/stores';
	import { EXCLUDED_FOOTER_ROUTES } from '$lib/constants';
	import { browser } from '$app/environment';

	/**
	 * SvelteKit offers Server-Side Rendering (SSR) out of the box,
	 * which allows you to generate HTML content on the server before sending it to the client.
	 * When using SSR, it's important to ensure that each client or request has its own isolated state.
	 * This becomes a concern particularly with Svelte stores, which, if defined at the module level,
	 * could accidentally share state between different clients or requests when running on the server.
	 * the reason for wrapping stores in context in SvelteKit is primarily to ensure that each SSR request
	 * has its own isolated store instance, preventing state from leaking between different users or requests.
	 */
	setContext(WEB3_KEY, _web3Store);
	setContext(ACCOUNT_KEY, _accountStore);
	setContext(TX_KEY, _txStore);

	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let txStore = getTxStore();

	// adjust the chain id here for the whole app
	const chainId = ChainId.POLYGON_MUMBAI;

	$: provider = $accountStore?.provider;
	$: address = $accountStore?.address;
	$: isConnected = $accountStore?.isConnected;

	// required for PWA Support
	$: webManifestLink = pwaInfo?.webManifest.linkTag ?? '';
	$: currentPage = $page.url.pathname;
	$: excludedRoute = EXCLUDED_FOOTER_ROUTES.includes(
		currentPage as (typeof EXCLUDED_FOOTER_ROUTES)[number]
	);

	// update localstorage with transaction updates
	$: {
		if (Object.keys($txStore.transactions).length > 0) {
			const currentValue = readTransactionsFromLocalStorage();
			if (JSON.stringify(currentValue) !== JSON.stringify($txStore.transactions)) {
				writeTransactionsToLocalStorage($txStore);
			}
		}
	}

	// watch the txStore for changes in the txCounter and refresh the web3Store
	$: {
		if ($txStore && address && provider && web3Store) {
			refreshW3Store(address, provider, web3Store);
		}
	}

	// attempt to connect when the user loads the page and fetch web3data
	onMount(async () => {
		try {
			loadTheme();
			setChainId(web3Store, chainId);
			await connect(chainId);
			const savedTransactions = readTransactionsFromLocalStorage();
			if (savedTransactions) {
				txStore.update((s) => {
					s.transactions = {
						...savedTransactions,
						...s.transactions
					};
					return s;
				});
			}
			if (provider && address) {
				// watcher pools on a 30 block interval
				watchW3Store(address, provider, web3Store, 30);
			}
		} catch (e) {
			console.log('Failed to connect', e);
		}
	});
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

{#if browser}
	<Toast />
{/if}
<Splash isLoading={!isConnected} />
<div class="md:max-w-[1990px] h-full">
	<slot />
</div>
<!-- Footer nav on most pages -->
{#if !excludedRoute}
	<Footer />
{/if}

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await}
