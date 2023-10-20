<script lang="ts">
	import NetworkLogos from './network-logos.svelte';
	import NetworkNames from './network-names.svelte';
</script>

<div class="flex items-center">
	<div class="h-8 w-8 bg-popover flex items-center justify-center rounded-full">
		<NetworkLogos class="h-5 w-5" />
	</div>
	<NetworkNames class="pl-2 font-bold" />
</div>
