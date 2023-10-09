<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	// replaced dynamically

	// @ts-ignore
	let buildDate = __DATE__;

	// @ts-ignore
	let reloadSW = __RELOAD_SW__;

	const reloadDurationInterval = 60 * 1000 * 1000; // 1 hour

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(r) {
			console.log('SW Registered', r);
			if (reloadSW) {
				r &&
					setInterval(() => {
						console.log('Checking for sw update');
						r.update();
					}, reloadDurationInterval);
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
					onClick: () => {
						updateServiceWorker(true);
						window.location.reload();
					}
				}
			});
		}
	}

	$: {
		console.log('SERVICE WORKER STATUS', {
			buildDate,
			buildDateLocal: new Date(buildDate).toLocaleString(),
			reloadSW,
			reloadDurationInterval,
			offlineReady: $offlineReady,
			needRefresh: $needRefresh
		});
	}
</script>

<div class="pwa-build-date">
	{buildDate}
</div>
