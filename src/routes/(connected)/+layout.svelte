<script lang="ts">
	import { initAccountStore, setConnectKit, type AppProvider } from '$stores/account';
	import { onMount } from 'svelte';
	import { loadTheme } from '$lib/components/ui/theme-toggle';
	import Toast from './toast.svelte';
	import {
		TASK_KEY,
		getAccountStore,
		getTaskStore,
		getTxStore,
		getWeb3Store
	} from '$lib/context/getStores';
	import { accountStore as _accountStore } from '$stores/account';
	import { taskStore as _taskStore } from '$stores/tasks';
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
	import NotificationHandler from './notifications/notificationHandler.svelte';
	import { fade } from 'svelte/transition';
	import { ethers } from 'ethers';
	import type { EVMProvider, ParticleConnect } from '@particle-network/connect';
	import { getCachedProvider } from '$stores/account/particle';
	import { toast } from 'svelte-sonner';
	import { PUBLIC_CHAIN_ID } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { particleChains } from '$stores/account/particle-chains';
	import type { ChainId } from '@biconomy/core-types';
	import { logIfNotInLocalStorage } from '../api/smartAccount/postAccount';
	import { initializeTaskStore } from '$stores/tasks';

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
	setContext(TASK_KEY, _taskStore);

	// use these in your components to access the stores instead of the stores directly
	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let txStore = getTxStore();
	let taskStore = getTaskStore();

	let lastTxCount = 0;
	let toastId: number | string | null = null;
	let onSupportedChain: boolean | null = null;

	// adjust the chain id here for the whole app
	let chainId = Number(PUBLIC_CHAIN_ID);

	if (!chainId) {
		throw new Error('Chain ID not found in the Environment');
	}

	const WATCH_INTERVAL = 30; // seconds

	$: provider = $accountStore?.provider;
	$: connectKit = $accountStore?.connectKit;
	$: address = $accountStore?.address;
	$: eoa = $accountStore?.eoa;
	$: isConnected = $accountStore?.isConnected;
	$: smartAccount = $accountStore?.smartAccount;
	$: showSplash = !isConnected && currentPage !== ROUTES.LOGIN;
	$: currentPage = browser ? $page.url.pathname : '';

	// don't show the footer on certain pages
	$: excludedRoute = EXCLUDED_FOOTER_ROUTES.includes(
		currentPage as (typeof EXCLUDED_FOOTER_ROUTES)[number]
	);

	async function checkChainAndSetupListeners(
		p: AppProvider | undefined = provider
	): Promise<boolean> {
		try {
			if (!connectKit || !p) {
				console.warn('No connectKit or provider');
				return false;
			}
			onSupportedChain = await checkChainIdIsCorrect(p);

			if (onSupportedChain === false) {
				const success = await trySwitchChain(connectKit);
				if (!success) return false;
			}

			if (!address || !smartAccount) {
				console.warn('No address or smartAccount found, cannot set listeners');
				return false;
			}

			await initializeTxStore(txStore, address, p, smartAccount);
			p.removeAllListeners();
			await watchW3Store(web3Store, address, p, WATCH_INTERVAL);
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	async function checkChainIdIsCorrect(p: AppProvider): Promise<boolean | null> {
		if (!p) return null;
		const currentNetwork = await p.getNetwork();
		return currentNetwork.chainId === chainId;
	}

	async function trySwitchChain(kit: ParticleConnect): Promise<boolean> {
		try {
			await kit.switchChain(particleChains[chainId as ChainId]);
			onSupportedChain = true;
			return true;
		} catch (e) {
			console.log('Error switching chains: usually a problem with the wallet');
			return false;
		}
	}

	$: {
		if (onSupportedChain === false && browser) {
			const chainName = particleChains[chainId as ChainId].fullname;
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

	$: {
		// if the address changes, refresh the web3Store
		if (address && web3Store) {
			refreshW3Store(web3Store, address, provider);
		}
	}

	$: {
		if (address && taskStore) {
			initializeTaskStore(taskStore, address);
		}
	}

	onMount(async () => {
		try {
			loadTheme();
			setChainId(web3Store, chainId);

			// init the connection
			const kit = setConnectKit(accountStore, chainId);

			// setup listeners at the root
			// this works for external providers but not social logins
			kit.on('connect', (p) => {
				if (!chainId) throw new Error('No chain id');
				const evmp = p as EVMProvider;
				const provider = new ethers.providers.Web3Provider(evmp, 'any');
				initAccountStore(accountStore, chainId, provider).then(() => {
					checkChainAndSetupListeners(provider);
				});
			});

			// watch for chain changes
			kit.on('chainChanged', () => {
				checkChainAndSetupListeners();
			});

			// connect will try to use a cached provider if it exists
			if (!isConnected) {
				const cachedProvider = await getCachedProvider(kit);
				if (!cachedProvider) goto(ROUTES.LOGIN);
				else {
					await initAccountStore(accountStore, chainId, cachedProvider);
					checkChainAndSetupListeners(cachedProvider);
				}
			}

			if (address) initializeTaskStore(taskStore, address);
		} catch (e) {
			console.log('Failed to connect', e);
			goto(ROUTES.LOGIN);
		}
	});

	$: {
		if (eoa && address) {
			logIfNotInLocalStorage(eoa, address);
		}
	}
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
