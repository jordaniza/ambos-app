<script lang="ts">
	import { getWeb3Store } from '$lib/context/getStores';
	import { disconnect } from '$stores/account';
	import Button from '../ui/button/button.svelte';

	let web3Store = getWeb3Store();

	$: chainId = $web3Store.chainId;

	async function logout(): Promise<void> {
		if (!chainId) throw new Error('No chainId');
		await disconnect(chainId);
		// reload the page
		window.location.reload();
	}
</script>

<Button on:click={logout}>Logout</Button>
