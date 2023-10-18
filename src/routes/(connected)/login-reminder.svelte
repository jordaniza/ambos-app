<script lang="ts">
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { connect } from '$stores/account';
	import { toast } from 'svelte-sonner';

	export let firstLoad: boolean;

	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let connectionToast: string | number | null = null;
	let chainId = $web3Store.chainId ?? 1;

	// dismiss the toast if the user connects
	$: {
		if (connectionToast && $accountStore && $accountStore?.isConnected) {
			toast.dismiss(connectionToast);
		}
	}

	// show the toast if the user disconnects, but not while the app is loading
	$: {
		if (!firstLoad && $accountStore && !$accountStore?.isConnected) {
			connectionToast = toast.warning(
				'Account is not connected. Please connect your wallet to continue.',
				{
					duration: Infinity,

					action: {
						label: 'Reconnect',
						onClick: () => {
							connect(chainId);
						}
					}
				}
			);
		}
	}
</script>
