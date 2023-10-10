<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	// replaced dynamically

	// @ts-ignore
	let buildDate = __DATE__;

	// @ts-ignore
	let reloadSW = __RELOAD_SW__;

	let interval: NodeJS.Timeout;
	const reloadDurationInterval = 60 * 60 * 1000; // 1 hour

	onMount(() => {
		interval = setInterval(() => {
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.getRegistrations().then((registrations) => {
					for (let registration of registrations) {
						if (registration.waiting) {
							console.log('[SW::WAITING]');
							registration.waiting.postMessage({ type: 'SKIP_WAITING' });
							$needRefresh = true;
						}
					}
				});
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(r) {
			console.log('[SW::Registered]', r);
			if (reloadSW) {
				console.log('[SW::RELOADING TIME]', Date.now() + reloadDurationInterval);
				// initial update
				r &&
					setInterval(() => {
						console.log('[SW::UPDATING]');
						r.update();
					}, reloadDurationInterval);
			} else {
				console.log('[SW::NO RELOAD]');
			}
		},
		onRegisterError(error) {
			console.log('[SW::REGISTRATION ERROR]', error);
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
		console.log('[SW::STATUS]', {
			buildDate,
			buildDateLocal: new Date(buildDate).toLocaleString(),
			reloadSW,
			reloadDurationInterval,
			offlineReady: $offlineReady,
			needRefresh: $needRefresh,
			swVersion: 0.1
		});
	}
</script>

<div class="pwa-build-date">
	{buildDate}
</div>
