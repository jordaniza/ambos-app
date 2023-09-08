<script lang="ts">
	import { Loader2 as Loader } from 'lucide-svelte';

	export let isLoading = true;

	let loader;
</script>

{#if isLoading}
	<Loader bind:this={loader} class="animate-spin" {...$$props} />
{/if}
