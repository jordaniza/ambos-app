<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	// replaced dynamically

	// @ts-ignore
	let buildDate = __DATE__;

	// @ts-ignore
	let reloadSW = __RELOAD_SW__;

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(r) {
			if (reloadSW) {
				r &&
					setInterval(() => {
						console.log('Checking for sw update');
						r.update();
					}, 20000 /* 20s for testing purposes */);
			} else {
				console.log(`SW Registered: ${r}`);
			}
		},
		onRegisterError(error) {
			console.log('SW registration error', error);
		}
	});

	$: {
		if ($offlineReady) {
			toast.info('App ready to work offline');
		} else if ($needRefresh) {
			toast.info('New content available, click on reload button to update.', {
				duration: Number.POSITIVE_INFINITY,
				action: {
					label: 'Reload',
					onClick: () => updateServiceWorker(true)
				}
			});
		}
	}

	$: {
		console.log('SERVICE WORKER STATUS', {
			buildDate,
			buildDateLocal: new Date(buildDate).toLocaleString(),
			reloadSW,
			offlineReady: $offlineReady,
			needRefresh: $needRefresh
		});
	}
</script>

<div class="pwa-build-date">
	{buildDate}
</div>
