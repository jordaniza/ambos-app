<script lang="ts">
	import { getWeb3Store } from '$lib/context/getStores';
	import { ChainId } from '@biconomy/core-types';

	export let chainId: number | string | undefined = undefined;

	let web3Store = getWeb3Store();

	// use the store value if chain is not provided
	$: _chainId = chainId || $web3Store.chainId;
	$: networkName = NETWORK_NAMES[_chainId as keyof typeof NETWORK_NAMES] ?? NETWORK_NAMES[1];

	export const NETWORK_NAMES = {
		[ChainId.MAINNET]: 'Ethereum',
		[ChainId.POLYGON_MUMBAI]: 'Polygon (Testnet)',
		[ChainId.ARBITRUM_GOERLI_TESTNET]: 'Arbitrum (Testnet)',
		[ChainId.ARBITRUM_ONE_MAINNET]: 'Arbitrum'
	};
</script>

<p {...$$restProps}>{networkName}</p>
