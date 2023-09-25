<script lang="ts">
	import type { EthereumAddress } from '$lib/utils';
	import Button from '../ui/button/button.svelte';
	import type { ITransakDto } from './Interface';
	import { initOnRamp } from './transak';

	export let receiveAddress: EthereumAddress | undefined;
	export let selectedNetwork: string;
	export let cls: string = '';
	export let options: Partial<ITransakDto> = {};

	function onClick() {
		if (!receiveAddress) return;
		initOnRamp(selectedNetwork, receiveAddress, options);
	}
</script>

<Button class={cls} disabled={!receiveAddress || !selectedNetwork} on:click={onClick}>Buy</Button>
