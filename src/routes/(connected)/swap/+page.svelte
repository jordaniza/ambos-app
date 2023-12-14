<script>
	import Card from '$lib/components/ui/card/card.svelte';
	import Swap from './swap.svelte';
</script>

<div class="p-4 flex items-center justify-center h-screen w-full">
	<Card variant="popover" padding="base" class="w-full">
		<Swap />
	</Card>
</div>
