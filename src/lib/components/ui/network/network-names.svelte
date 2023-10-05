<script lang="ts">
	import { getWeb3Store } from '$lib/context/getStores';

	export let chainId: number | string | undefined = undefined;

	let web3Store = getWeb3Store();

	// use the store value if chain is not provided
	$: _chainId = chainId || $web3Store.chainId;
	$: networkName = NETWORK_NAMES[_chainId as keyof typeof NETWORK_NAMES] ?? NETWORK_NAMES[1];

	export const NETWORK_NAMES = {
		1: 'Ethereum',
		80001: 'Polygon (Testnet)'
	};
</script>

<p {...$$restProps}>{networkName}</p>
