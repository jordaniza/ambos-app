<script lang="ts">
	import { initAccountStore, setConnectKit, initMulticallProvider } from '$stores/account';
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
	import { getCachedProvider } from '$stores/account/particle';
	import { ChainMap } from '$lib/contracts';
	import { toast } from 'svelte-sonner';
	import type { MulticallProvider } from '@0xsequence/multicall/dist/declarations/src/providers';

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
	let onSupportedChain: boolean | null = null;
	let walletAddress = '';

	// adjust the chain id here for the whole app
	const chainId = ChainId.POLYGON_MUMBAI;
	const WATCH_INTERVAL = 30; // seconds

	$: provider = $accountStore?.provider;
	$: connectKit = $accountStore?.connectKit;
	$: address = $accountStore?.address;
	$: isConnected = $accountStore?.isConnected;
	$: smartAccount = $accountStore?.smartAccount;
	$: currentPage = $page.url.pathname;
	$: showSplash = !isConnected && currentPage !== ROUTES.LOGIN;

	// don't show the footer on certain pages
	$: excludedRoute = EXCLUDED_FOOTER_ROUTES.includes(
		currentPage as (typeof EXCLUDED_FOOTER_ROUTES)[number]
	);

	async function checkChainAndSetupListeners(
		p: MulticallProvider | ethers.providers.Web3Provider | undefined = provider
	) {
		try {
			if (!connectKit || !p) {
				console.warn('No connectKit or provider');
				return;
			}
			const multiP = initMulticallProvider(p as ethers.providers.Web3Provider)!;
			onSupportedChain = await checkChainIdIsCorrect(multiP);

			if (onSupportedChain === false) {
				const success = await trySwitchChain(connectKit);
				if (!success) return;
			}

			if (!address || !smartAccount) {
				console.warn('No address or smartAccount found, cannot set listeners');
				return;
			}

			await initializeTxStore(txStore, address, multiP, smartAccount);
			p.removeAllListeners();
			watchW3Store(web3Store, address, multiP, WATCH_INTERVAL);
		} catch (e) {
			console.error(e);
		}
	}

	async function checkChainIdIsCorrect(p: MulticallProvider): Promise<boolean | null> {
		if (!p) return null;
		const currentNetwork = await p.getNetwork();
		return currentNetwork.chainId === chainId;
	}

	async function trySwitchChain(kit: ParticleConnect): Promise<boolean> {
		try {
			await kit.switchChain(ChainMap[chainId]);
			onSupportedChain = true;
			return true;
		} catch (e) {
			console.log('Error switching chains: usually a problem with the wallet');
			return false;
		}
	}

	$: {
		if (onSupportedChain === false && browser) {
			const chainName = ChainMap[chainId].fullname;
			toastId = toast.error(`Unsupported chain, please switch to ${chainName}`, {
				duration: Infinity
			});
		} else if (onSupportedChain && toastId !== null) {
			toast.dismiss(toastId);
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
			loadTheme();
			setChainId(web3Store, chainId);

			// init the connection
			const kit = setConnectKit(accountStore, chainId);

			// setup listeners at the root
			kit.on('connect', (p) => {
				if (!chainId) throw new Error('No chain id');
				const evmp = p as EVMProvider;
				const provider = new ethers.providers.Web3Provider(evmp, 'any');
				provider.listAccounts().then((accounts) => {
					walletAddress = accounts[0];
				});
				initAccountStore(accountStore, chainId, provider);
				checkChainAndSetupListeners(provider);
			});

			// watch for chain changes
			kit.on('chainChanged', () => {
				checkChainAndSetupListeners();
			});

			// connect will try to use a cached provider if it exists
			if (!isConnected) {
				const cachedProvider = await getCachedProvider(kit);
				if (!cachedProvider) goto(ROUTES.LOGIN);
				else initAccountStore(accountStore, chainId, cachedProvider);
			}
		} catch (e) {
			console.log('Failed to connect', e);
			goto(ROUTES.LOGIN);
		}
	});
</script>

{#if browser}
	<Toast />
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
