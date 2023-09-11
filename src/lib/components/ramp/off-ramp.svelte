<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import { initOffRamp } from './transak';

	export let toSell: number;
	export let selectedNetwork: string;
	export let cls: string = '';

	function onClick() {
		initOffRamp(selectedNetwork, toSell);
	}
</script>

<Button class={cls} disabled={toSell === 0 || !selectedNetwork} on:click={onClick}>Sell</Button>
