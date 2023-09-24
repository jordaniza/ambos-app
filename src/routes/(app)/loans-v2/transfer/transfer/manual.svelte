<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getAccountStore } from '$lib/context/getStores';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	export let verifying: boolean;

	let accountStore = getAccountStore();
	let canvas: HTMLCanvasElement;

	$: address = $accountStore.address ?? '0x...';

	const setVerifying = () => {
		checked = false;
		verifying = true;
	};

	let checked: boolean = false;

	async function copyAddressToClipboard() {
		toast.success('Copied to clipboard');
		await navigator.clipboard.writeText(address);
	}

	$: {
		if (canvas) {
			QRCode.toCanvas(canvas, address, function (error) {
				if (error) console.error(error);
			});
		}
	}

	onMount(() => {
		canvas = document.getElementById('canvas') as HTMLCanvasElement;
	});
</script>

<Card class="flex flex-col gap-3 items-center justify-between px-3 py-2 text-sm text-center">
	<p class="w-full font-bold text-destructive">Network Caution!</p>
	<p class="w-full">
		Ensure you send ETH to the correct network to avoid irreversible loss of funds!
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
	<p class="border-secondary rounded-xl border p-2 w-full text-xs font-mono">{address}</p>
	<Button
		variant="secondary"
		class="px-5 py-0"
		disabled={!checked}
		on:click={copyAddressToClipboard}>Copy Address</Button
	>
	<div class="relative flex items-center justify-center w-full text-center">
		<div class="absolute w-11/12 h-[1px] top-1/2 bg-accent-foreground" />
		<p class="bg-white text-xs text-muted-foreground h-5 w-5 z-10 transform translate-y-0.5">or</p>
	</div>
	<canvas id="canvas" class="h-32 w-32">Scan QR Code</canvas>
	<Button disabled={!checked} class="w-11/12 rounded-lg" on:click={setVerifying}
		>Verify Sent ETH</Button
	>
	<Button variant="link" class="-mt-3">For doubts or issues, see our Help Section</Button>
</div>
