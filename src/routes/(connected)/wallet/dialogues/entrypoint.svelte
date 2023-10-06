<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	export const trigger = () => {
		open = true;
	};
	export let open = false;
	export let title: string;
</script>

<Dialog.Root bind:open>
	<Dialog.FlyInContent showCloseIcon={false} class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">{title}</Dialog.Title>
		<div class="flex flex-col p-4 gap-3">
			<Card class="rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none">
				<div class="flex items-center gap-2">
					<img src="/external/eth.png" alt="eth" class="h-8 w-8" />
					<p>Ether</p>
				</div>
				<p>ETH</p>
			</Card>
			<Card class="rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none">
				<div class="flex items-center gap-2">
					<img src="/external/usdc.png" alt="eth" class="h-8 w-8" />
					<p>USDC</p>
				</div>
				<p>USDC</p>
			</Card>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
