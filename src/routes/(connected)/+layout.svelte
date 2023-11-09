<script lang="ts">
	import { connect } from '$stores/account';
	import { onDestroy, onMount } from 'svelte';
	import { ChainId } from '@biconomy/core-types';
	import { loadTheme } from '$lib/components/ui/theme-toggle';
	import Toast from './toast.svelte';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { accountStore as _accountStore } from '$stores/account';
	import { setContext } from 'svelte';
	import { web3Store as _web3Store, watchW3Store, refreshW3Store } from '$stores/web3';
	import {
		txStore as _txStore,
		initializeTxStore,
		updateLocalStorageWithStoreChanges
	} from '$stores/transactions/state';
	import { ACCOUNT_KEY, TX_KEY, WEB3_KEY } from '$lib/context/getStores';
	import { setChainId } from '$stores/web3/actions';
	import Footer from './footer.svelte';
	import Splash from './splash.svelte';
	import { page } from '$app/stores';
	import { EXCLUDED_FOOTER_ROUTES, ROUTES } from '$lib/constants';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import NotificationHandler from './notifications/notificationHandler.svelte';
	import { fade } from 'svelte/transition';
	import { ethers } from 'ethers';
	import type { EVMProvider, ParticleConnect } from '@particle-network/connect';
	import { initConnectKit } from '$stores/account/particle';
	import { ChainMap } from '$lib/contracts';
	import { toast } from 'svelte-sonner';

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

	// use these in your components to access the stores instead of the stores directly
	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let txStore = getTxStore();

	let lastTxCount = 0;
	let toastId: number | string | null = null;
	// has the application loaded for the first time
	let firstLoad = true;
	let onSupportedChain = false;
	let connectKit: ParticleConnect;

	// adjust the chain id here for the whole app
	const chainId = ChainId.POLYGON_MUMBAI;
	const WATCH_INTERVAL = 30; // seconds

	$: provider = $accountStore?.provider;
	$: address = $accountStore?.address;
	$: isConnected = $accountStore?.isConnected;
	$: smartAccount = $accountStore?.smartAccount;
	$: currentPage = $page.url.pathname;
	$: showSplash = !isConnected && currentPage !== ROUTES.LOGIN;

	// don't show the footer on certain pages
	$: excludedRoute = EXCLUDED_FOOTER_ROUTES.includes(
		currentPage as (typeof EXCLUDED_FOOTER_ROUTES)[number]
	);

	async function tryConnectAndSwitch(chainId: number) {
		if (!connectKit) {
			throw new Error('No connectKit');
		}
		try {
			// try connecting to the cached provider
			const evmp = (await connectKit.connectToCachedProvider()) as EVMProvider;
			if (!evmp) {
				throw new Error('No provider found');
			}

			// attempt to connect and build the account store
			await connect(accountStore, chainId, new ethers.providers.Web3Provider(evmp, 'any'));

			// attempt to switch to the correct chain (this returns if the chain is already correct)
			await trySwitchChain(connectKit);

			// validate the chain is correct
			onSupportedChain = await checkChainIdIsCorrect();
			if (!onSupportedChain) return;

			// initialize the txStore and watch for changes
			await initializeTxStore(txStore, address!, provider!, smartAccount!);
			watchW3Store(web3Store, address!, provider!, WATCH_INTERVAL);
		} catch (e) {
			// if this can't be done, go to the login page
			console.error(e);
			goto(ROUTES.LOGIN);
		}
	}

	async function checkChainIdIsCorrect(): Promise<boolean> {
		if (!provider) return false;
		const currentNetwork = await provider.getNetwork();
		return currentNetwork.chainId === chainId;
	}

	async function trySwitchChain(kit: ParticleConnect) {
		onSupportedChain = await checkChainIdIsCorrect();

		if (onSupportedChain) {
			if (toastId) toast.dismiss(toastId);
			return;
		}

		try {
			await kit.switchChain(ChainMap[chainId]);
			onSupportedChain = true;
			if (toastId) toast.dismiss(toastId);
		} catch (e) {
			console.log('chain switch error', e);
		}
	}

	$: {
		if (!onSupportedChain) {
			const chainName = ChainMap[chainId].fullname;
			toastId = toast.error(`Unsupported chain, please switch to ${chainName}`, {
				duration: Infinity
			});
		} else {
			if (toastId) toast.dismiss(toastId);
		}
	}

	// keep the localStorage transactions in sync with the txStore
	$: {
		if (Object.keys($txStore.transactions).length > 0 && address) {
			updateLocalStorageWithStoreChanges(txStore, address);
		}
	}

	// watch the txStore for changes in the txCounter and refresh the web3Store
	$: {
		if ($txStore && web3Store) {
			if ($txStore.txCounter !== lastTxCount) {
				lastTxCount = $txStore.txCounter;
				refreshW3Store(web3Store, address, provider);
			}
		}
	}

	onMount(async () => {
		try {
			// load globals and connect to web3
			loadTheme();
			setChainId(web3Store, chainId);
			connectKit = initConnectKit(chainId);
			connectKit.on('chainChanged', async (to) => {
				tryConnectAndSwitch(chainId);
			});
			tryConnectAndSwitch(chainId);
		} catch (e) {
			console.log('Failed to connect', e);
		}
	});
</script>

{#if browser}
	<Toast />
	<!-- <LoginReminder bind:firstLoad /> -->
	<NotificationHandler />
{/if}
<Splash {showSplash} />
{#key currentPage}
	<div in:fade={{ duration: 200 }} class="md:max-w-[1990px] h-full">
		<slot />
	</div>
{/key}
<!-- Footer nav on most pages -->
{#if !excludedRoute && isConnected}
	<Footer />
{/if}
