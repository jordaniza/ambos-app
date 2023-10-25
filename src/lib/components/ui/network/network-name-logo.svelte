<script lang="ts">
	import Card from '../card/card.svelte';
	import TooltipIcon from '../tooltip/tooltip-icon.svelte';
	import { TOOLTIPS } from '../tooltip/tooltips';
	import NetworkLogos from './network-logos.svelte';
	import NetworkNames from './network-names.svelte';
</script>

<Card class="flex justify-between px-3 py-2 text-sm shadow-none">
	<div class="flex items-center gap-2">
		<div class="h-8 w-8 bg-popover flex items-center justify-center rounded-full">
			<NetworkLogos class="h-5 w-5" />
		</div>
		<p class="font-bold">Network</p>
	</div>
	<div class="flex items-center justify-end gap-2">
		<NetworkNames />
		<TooltipIcon text={TOOLTIPS.NETWORK} />
	</div>
</Card>
