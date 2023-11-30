<script lang="ts">
	import { goto } from '$app/navigation';
	import { LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
	import { getAccountStore } from '$lib/context/getStores';
	import { disconnect } from '$stores/account';
	import Button from '../ui/button/button.svelte';

	let accountStore = getAccountStore();

	async function logout(): Promise<void> {
		localStorage.removeItem(LOCAL_STORAGE_KEYS.WELCOME);
		localStorage.removeItem(LOCAL_STORAGE_KEYS.LOG_ETHEREUM_ADDRESS);
		await disconnect(accountStore);
		goto(ROUTES.LOGIN);
	}
</script>

<Button on:click={logout} {...$$restProps}>Logout</Button>
