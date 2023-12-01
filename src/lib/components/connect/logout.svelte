<script lang="ts">
	import { goto } from '$app/navigation';
	import { LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
	import { getAccountStore, getTxStore, getWeb3Store } from '$lib/context/getStores';
	import { disconnect } from '$stores/account';
	import { resetStore as resetTxStore } from '$stores/transactions/state';
	import { resetStore as resetWeb3Store } from '$stores/web3';
	import Button from '../ui/button/button.svelte';

	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let txStore = getTxStore();

	async function logout(): Promise<void> {
		localStorage.removeItem(LOCAL_STORAGE_KEYS.WELCOME);
		localStorage.removeItem(LOCAL_STORAGE_KEYS.LOG_ETHEREUM_ADDRESS);
		await disconnect(accountStore);
		resetWeb3Store(web3Store);
		resetTxStore(txStore);
		// not technically necessary, but it's nice to have the page reload to clear any state
		window.location.reload();
	}
</script>

<Button on:click={logout} {...$$restProps}>Logout</Button>
