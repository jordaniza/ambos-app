<script lang="ts">
	import '../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import { AppBar, AppShell, storeHighlightJs } from '@skeletonlabs/skeleton';
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	import { initializeStores, Drawer, getDrawerStore, Toast } from '@skeletonlabs/skeleton';
	initializeStores();

	import { connect, accountStore } from '$stores/account';
	import { onMount } from 'svelte';
	import { ChainId } from '@biconomy/core-types';
	import { web3Store } from '$stores/web3';
	import { watchSupportedTokenBalances } from '$stores/web3/getBalances';
	import { watchEthPrice } from '$stores/web3/getPrices';
	import Nav from './nav.svelte';
	import { APP_NAME, ROUTES } from '$lib/constants';

	const drawerStore = getDrawerStore();
	$: provider = $accountStore?.provider;
	$: address = $accountStore?.address;
	// attemp to connect when the user loads the page
	onMount(async () => {
		try {
			await connect(ChainId.POLYGON_MUMBAI);
			if (provider && address) {
				console.log('Connected');
				watchSupportedTokenBalances(address, provider, web3Store, 30);
				watchEthPrice(provider, web3Store, 30);
			}
		} catch (e) {
			console.log('Failed to connect', e);
		}
	});
	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<Toast />
<Drawer width="w-64">
	<Nav />
</Drawer>
<AppShell slotSidebarLeft="p-4">
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="flex items-center w-full justify-between">
					<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-5 h-5">
								<rect width="100" height="10" />
								<rect y="30" width="100" height="10" />
								<rect y="60" width="100" height="10" />
							</svg>
						</span>
					</button>
				</div>
			</svelte:fragment>
			<strong class="text-xl uppercase">{APP_NAME}</strong>
			<svelte:fragment slot="trail">
        <a href={ROUTES.PROFILE} class="flex items-center">
          JA
        </a>
      </svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
