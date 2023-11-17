<script lang="ts">
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants';
	import { getAccountStore } from '$lib/context/getStores';
	import { toast } from 'svelte-sonner';

	export let firstLoad: boolean;

	let accountStore = getAccountStore();
	let connectionToast: string | number | null = null;

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
							goto(ROUTES.LOGIN);
						}
					}
				}
			);
		}
	}
</script>
