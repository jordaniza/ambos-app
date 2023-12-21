<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getAccountStore } from '$lib/context/getStores';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { AMBOS_FAQ } from '$lib/constants';
	import NetworkNameLogo from '$lib/components/ui/network/network-name-logo.svelte';

	export const trigger = () => {
		open = true;
	};
	export let open = false;

	let accountStore = getAccountStore();
	let canvas: HTMLCanvasElement;
	let checked: boolean = false;

	$: address = $accountStore.address ?? '0x...';
	$: blurClass = checked ? ' blur-none ' : ' blur-sm ';

	async function copyAddressToClipboard() {
		toast.success('Copied to clipboard');
		await navigator.clipboard.writeText(address);
	}

	$: {
		if (open && !canvas) {
			setTimeout(() => (canvas = document.getElementById('canvas') as HTMLCanvasElement), 0);
		}
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
		<div class="flex w-full flex-col gap-5">
			<p class="font-3xl font-extrabold text-center">Receive/Transfer</p>
			<Card class="flex flex-col gap-3 items-center justify-between px-3 py-4 text-sm text-center">
				<div class="w-full">
					<NetworkNameLogo showTooltip={false} />
				</div>
				<p class="w-full">
					Ensure you send tokens to the correct network to avoid irreversible loss of funds!
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

				<div class="text-center flex flex-col gap-3 items-center">
					<p class="font-bold">Your Ambos Wallet Address</p>
					<p class="text-sm">Send tokens to your Ambos Wallet</p>
					<p
						class={blurClass +
							' border-secondary rounded-xl border p-2 w-full text-xs font-mono truncate whitespace-nowrap max-w-md'}
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
						<p
							class="bg-white text-xs text-muted-foreground h-5 w-5 z-10 transform translate-y-0.5"
						>
							or
						</p>
					</div>
					<canvas id="canvas" class={blurClass + ' h-32 w-32 '}>Scan QR Code</canvas>
					<Button variant="link" class="-mt-3">
						<a class="w-full" href={AMBOS_FAQ} target="_blank">
							For doubts or issues, see our Help Section</a
						></Button
					>
				</div>
			</Card>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
