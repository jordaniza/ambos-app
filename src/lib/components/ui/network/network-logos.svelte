<script lang="ts">
	import { getWeb3Store } from '$lib/context/getStores';
	import { ChainId } from '@biconomy/core-types';

	export let chainId: number | string | undefined = undefined;

	let web3Store = getWeb3Store();

	// use the store value if chain is not provided
	$: _chainId = chainId || $web3Store.chainId;
	$: logo = logos[_chainId as keyof typeof logos] ?? logos[1];

	const logos = {
		[ChainId.MAINNET]: {
			img: '/external/eth.png',
			alt: 'Ethereum'
		},
		[ChainId.POLYGON_MUMBAI]: {
			img: '/external/polygon.png',
			alt: 'Polygon'
		},
		[ChainId.ARBITRUM_ONE_MAINNET]: {
			img: '/external/arbitrum.png',
			alt: 'Arbitrum'
		},
		[ChainId.ARBITRUM_GOERLI_TESTNET]: {
			img: '/external/arbitrum.png',
			alt: 'Arbitrum'
		}
	};
</script>

<img src={logo.img} alt={logo.alt} {...$$restProps} />
