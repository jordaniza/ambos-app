<script lang="ts">
	import { onMount } from 'svelte';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	let updateServiceWorker: (reloadPage: boolean) => void;

	onMount(() => {
		updateServiceWorker = function (reloadPage: boolean) {
			console.log('Updating service worker');
		};
	});
</script>

<button on:click={() => updateServiceWorker(true)} {...$$restProps}> Update Application </button>
