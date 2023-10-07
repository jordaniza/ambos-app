<script lang="ts">
	import { getTransakURLOff, getTransakURLOn } from '$lib/components/ramp/transak';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import type { EthereumAddress } from '$lib/utils';
	import { onMount } from 'svelte';
	import type { ITransakDto } from './Interface';

	export let options: Partial<ITransakDto> = {};
	export let direction: 'buy' | 'sell' = 'buy';

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
		if (direction === 'sell') {
			return getTransakURLOff(chainId, 1000, options);
		} else if (direction === 'buy') {
			return getTransakURLOn(chainId, address as EthereumAddress, options);
		} else {
			throw new Error('No direction found in transak widget');
		}
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
		title="TRANSAK WIDGET"
		id="transak-iframe"
		{src}
		allow="camera;microphone;fullscreen;payment"
		{...$$restProps}
	/>
{/if}
