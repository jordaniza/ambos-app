<script lang="ts">
	import '../../app.postcss';
	import Nav from './nav.svelte';

	import { connect } from '$stores/account';
	import { onMount } from 'svelte';
	import { ChainId } from '@biconomy/core-types';
	import { watchSupportedTokenBalances } from '$stores/web3/getBalances';
	import { watchEthPrice } from '$stores/web3/getPrices';
	import { watchPoolData } from '$stores/web3/getPoolData';
	import Toast from './toast.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { accountStore as _accountStore } from '$stores/account';
	import { setContext } from 'svelte';
	import { web3Store as _web3Store } from '$stores/web3';
	import { txStore } from '$stores/transactions/state';
	import { ACCOUNT_KEY, TX_KEY, WEB3_KEY } from '$lib/context/getStores';
	import { setChainId } from '$stores/web3/actions';

	/**
	 * SvelteKit offers Server-Side Rendering (SSR) out of the box,
	 * which allows you to generate HTML content on the server before sending it to the client.
	 * When using SSR, it's important to ensure that each client or request has its own isolated state.
	 * This becomes a concern particularly with Svelte stores, which, if defined at the module level,
	 * could accidentally share state between different clients or requests when running on the server.
	 *
	 * the reason for wrapping stores in context in SvelteKit is primarily to ensure that each SSR request
	 * has its own isolated store instance, preventing state from leaking between different users or requests.
	 * This makes the application more predictable and secure.
	 */
	setContext(WEB3_KEY, _web3Store);
	setContext(ACCOUNT_KEY, _accountStore);
	setContext(TX_KEY, txStore);

	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();

	// adjust the chain id here for the whole app
	const chainId = ChainId.POLYGON_MUMBAI;

	$: provider = $accountStore?.provider;
	$: address = $accountStore?.address;
	$: isConnected = $accountStore?.isConnected;
	// attemp to connect when the user loads the page
	onMount(async () => {
		try {
			setChainId(web3Store, chainId);
			await connect(chainId);
			if (provider && address) {
				console.log('Connected');
				watchSupportedTokenBalances(address, provider, web3Store, 30);
				watchEthPrice(provider, web3Store, 30);
				watchPoolData(address, provider, web3Store, 30);
			}
		} catch (e) {
			console.log('Failed to connect', e);
		}
	});
</script>

<Toast />
{#if !isConnected}<div
		class="absolute z-10 inset-0 bg-opacity-10 bg-black h-screen backdrop-blur"
	/>{/if}
<Nav />
<div class="md:max-w-[1990px] flex flex-col items-center md:mt-10 w-full h-screen mx-auto">
	<slot />
</div>
