<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getAccountStore } from '$lib/context/getStores';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';

	export const trigger = () => {
		open = true;
	};
	export let open = false;

	let accountStore = getAccountStore();
	let canvas: HTMLCanvasElement;
	let checked: boolean = false;
	let openReceive = false;

	$: address = $accountStore.address ?? '0x...';

	async function copyAddressToClipboard() {
		toast.success('Copied to clipboard');
		await navigator.clipboard.writeText(address);
	}

	function handleClick() {
		openReceive = true;
		open = false;
		setTimeout(() => {
			canvas = document.getElementById('canvas') as HTMLCanvasElement;
		}, 0);
	}

	$: {
		if (canvas) {
			QRCode.toCanvas(canvas, address, function (error) {
				if (error) console.error(error);
			});
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Receive/Transfer</Dialog.Title>
		<div class="flex flex-col gap-3">
			<button
				on:click={handleClick}
				class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
			>
				<div class="flex items-center gap-2">
					<img src="/external/eth.png" alt="eth" class="h-8 w-8" />
					<p>Ether</p>
				</div>
				<p>ETH</p>
			</button>
			<button
				on:click={handleClick}
				class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
			>
				<div class="flex items-center gap-2">
					<img src="/external/usdc.png" alt="eth" class="h-8 w-8" />
					<p>USDC</p>
				</div>
				<p>USDC</p>
			</button>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>

<Dialog.Root bind:open={openReceive}>
	<Dialog.FlyInContent class="bg-popover">
		<div class="flex w-full flex-col gap-5">
			<p class="font-3xl font-extrabold text-center">Receive/Transfer</p>
			<Card class="flex flex-col gap-3 items-center justify-between px-3 py-2 text-sm text-center">
				<p class="w-full font-bold text-destructive">Network Caution!</p>
				<p class="w-full">
					Ensure you send to the correct network to avoid irreversible loss of funds!
				</p>
				<div class="flex items-center space-x-2 pb-2">
					<Label
						for="terms"
						class="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						I acknowledge the network details.
					</Label>
					<Checkbox id="terms" bind:checked />
				</div>
			</Card>

			<div class="text-center flex flex-col gap-3 items-center">
				<p class="font-bold">Your Ambos Wallet Address</p>
				<p class="text-sm">Send ETH to your Ambos Wallet</p>
				<p
					class="border-secondary rounded-xl border p-2 w-full text-xs font-mono truncate whitespace-nowrap max-w-md"
				>
					{address}
				</p>
				<Button
					variant="secondary"
					class="px-5 py-0"
					disabled={!checked}
					on:click={copyAddressToClipboard}>Copy Address</Button
				>
				<div class="relative flex items-center justify-center w-full text-center">
					<div class="absolute w-11/12 h-[1px] top-1/2 bg-accent-foreground" />
					<p class="bg-white text-xs text-muted-foreground h-5 w-5 z-10 transform translate-y-0.5">
						or
					</p>
				</div>
				<canvas id="canvas" class="h-32 w-32">Scan QR Code</canvas>
			</div>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
