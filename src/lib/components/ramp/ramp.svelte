<script lang="ts">
	import { getTransakURLOff, getTransakURLOn } from '$lib/components/ramp/transak';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import type { EthereumAddress } from '$lib/utils';
	import type { ITransakDto } from './Interface';

	export let options: Partial<ITransakDto> = {};
	export let direction: 'buy' | 'sell' = 'buy';

	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let src: string | undefined = undefined;
	let mounted = false;

	$: address = $accountStore.address;
	$: chainId = $web3Store.chainId;

	$: {
		if (address && chainId) {
			src = getSrc();
		}
	}

	$: {
		if (!mounted && src) {
			mountTransak(src);
		}
	}

	function getSrc() {
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

	function mountTransak(source: string) {
		if (mounted || !source) return;

		const iframe = document.getElementById('transak-iframe') as HTMLIFrameElement;

		if (!iframe) return;

		const transakIframe = iframe.contentWindow;

		window.addEventListener('message', (message) => {
			if (message.source !== transakIframe) return;
			// This will trigger when the user marks payment is made
			if (message?.data?.event_id === 'TRANSAK_ORDER_SUCCESSFUL') {
				console.log('Order Data: ', message?.data?.data);
			}
		});
		mounted = true;
	}
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
