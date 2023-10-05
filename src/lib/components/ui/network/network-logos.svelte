<script lang="ts">
	import { getWeb3Store } from '$lib/context/getStores';

	export let chainId: number | string | undefined = undefined;

	let web3Store = getWeb3Store();

	// use the store value if chain is not provided
	$: _chainId = chainId || $web3Store.chainId;
	$: logo = logos[_chainId as keyof typeof logos] ?? logos[1];

	const logos = {
		1: {
			img: '/external/eth.png',
			alt: 'Ethereum'
		},
		80001: {
			img: '/external/polygon.png',
			alt: 'Polygon'
		}
	};
</script>

<img src={logo.img} alt={logo.alt} {...$$restProps} />
