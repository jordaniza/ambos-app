<script lang="ts">
	import { onMount } from 'svelte';

	let updateServiceWorker: (reloadPage: boolean) => void;

	onMount(() => {
		updateServiceWorker = (reloadPage: boolean) => {
			console.log('Updating service worker');
		};
	});
</script>

<button on:click={() => updateServiceWorker(true)} {...$$restProps}> Update Application </button>
