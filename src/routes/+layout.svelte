<script lang="ts">
	import '../app.postcss';
	import Nav from './nav.svelte';

	import { connect, accountStore } from '$stores/account';
	import { onMount } from 'svelte';
	import { ChainId } from '@biconomy/core-types';
	import { web3Store } from '$stores/web3';
	import { watchSupportedTokenBalances } from '$stores/web3/getBalances';
	import { watchEthPrice } from '$stores/web3/getPrices';
	import { watchPoolData } from '$stores/web3/getPoolData';
	import Toast from './toast.svelte';
	
	$: provider = $accountStore?.provider;
	$: address = $accountStore?.address;
	$: isConnected = $accountStore?.isConnected;
	// attemp to connect when the user loads the page
	onMount(async () => {
		try {
			await connect(ChainId.POLYGON_MUMBAI);
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

