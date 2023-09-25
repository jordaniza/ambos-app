<script lang="ts">
	import { getTransakNetwork, getTransakURLOn, optionsOn } from '$lib/components/ramp/transak';
	import Card from '$lib/components/ui/card/card.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import type { EthereumAddress } from '$lib/utils';
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
		return getTransakURLOn(chainId, address as EthereumAddress);
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

<Card class="bg-popover p-4 rounded-xl flex flex-col items-center gap-3">
	{#if src}
		<iframe
			title="TRANSAK ONRAMP"
			id="transak-iframe"
			{src}
			allow="camera;microphone;fullscreen;payment"
			class="border-0 h-[600px] w-full"
		/>
	{/if}
</Card>
