<script lang="ts">
	import OnRamp from '$lib/components/ramp/ramp.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	export let quantity = 300;
</script>

<Card class="bg-popover p-4 rounded-xl flex flex-col items-center gap-3">
	<OnRamp
		class="border-0 h-[550px] w-full"
		direction="buy"
		options={{
			defaultCryptoAmount: quantity
		}}
	/>
</Card>
