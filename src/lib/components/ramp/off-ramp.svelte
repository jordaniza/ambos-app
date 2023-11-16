<script lang="ts">
	import { getTransakURLOff } from '$lib/components/ramp/transak';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { onMount } from 'svelte';

	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let src = getSrc();

	function getSrc() {
		const { address } = $accountStore;
		const { chainId } = $web3Store;
		if (!address || !chainId) {
			console.error('No address or chainId found');
			return;
		}
		return getTransakURLOff(chainId, 1000);
	}

	onMount(() => {
		src = getSrc();
		const iframe = document.getElementById('transak-iframe')! as HTMLIFrameElement;
		const transakIframe = iframe.contentWindow;

		window.addEventListener('message', (message) => {
			if (message.source !== transakIframe) return;
			// This will trigger when the user marks payment is made
			if (message?.data?.event_id === 'TRANSAK_ORDER_SUCCESSFUL') {
				console.log('Order Data: ', message?.data?.data);
			}
		});
	});
</script>

{#if src}
	<iframe
		title="TRANSAK ONRAMP"
		id="transak-iframe"
		{src}
		allow="camera;microphone;fullscreen;payment"
		{...$$restProps}
	/>
{/if}
