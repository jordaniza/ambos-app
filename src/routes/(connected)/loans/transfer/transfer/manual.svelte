<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { AMBOS_FAQ, NETWORKS_AND_BRIDGING } from '$lib/constants';
	import NetworkNameLogo from '$lib/components/ui/network/network-name-logo.svelte';
	import NetworkNames from '$lib/components/ui/network/network-names.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { CHAIN_ETH_TYPE } from '$lib/contracts';

	// show the verification spinner
	export let showVerification: boolean;

	// behind the scenes, the verification process is started
	export let startVerification: boolean;

	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();
	let canvas: HTMLCanvasElement;
	let accordionOpen: boolean;
	let padding = 'py-2';

	$: chainId = $web3Store.chainId ?? 1;
	$: ethType = CHAIN_ETH_TYPE[chainId] ?? 'ETH';
	$: address = $accountStore.address ?? '0x...';
	$: blurClass = checked ? ' blur-none ' : ' blur-sm ';

	const setVerifying = () => {
		checked = false;
		showVerification = true;
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

	$: {
		if (checked) {
			startVerification = true;
			setTimeout(() => (canvas = document.getElementById('canvas') as HTMLCanvasElement), 0);
		}
	}

	function onValueChange(value: string | string[] | undefined) {
		if (value === '0') {
			if (!accordionOpen) {
				padding = 'py-4';
				accordionOpen = true;
			}
		} else {
			padding = 'py-2';
			accordionOpen = false;
		}
	}

	onMount(() => {
		canvas = document.getElementById('canvas') as HTMLCanvasElement;
	});
</script>

<!-- Address viewerr -->

<Card class="flex flex-col gap-3 items-center justify-between px-3 py-4 text-sm text-center">
	<p class="text-destructive font-bold">🛑 Network Confirmation Required! 🛑</p>
	<div class="w-full">
		<NetworkNameLogo />
	</div>

	<Card variant="popover" padding="base" class={'w-full shadow-none ' + padding}>
		<Accordion.Root class="w-full items-center " {onValueChange}>
			<Accordion.Item class="px-3 text-left" value={'0'}>
				<Accordion.Trigger class="font-bold text-center">What is a Network?</Accordion.Trigger>
				<Accordion.Content class="pt-5 ">
					<div class="flex flex-col gap-3">
						<p>
							A single cryptocurrency can exist on a variety of networks, it's crucial to only send
							assets to and from the correct one.
						</p>
						<button class="font-bold text-secondary underline">
							<a href={NETWORKS_AND_BRIDGING} target="_blank"> Learn More</a></button
						>
						<p>
							<b>Sending {ethType} from the wrong network can result in irreversible loss!</b>
							<br /><br />Double check that you are only sending {ethType} on the
							<span class="inline-block"><NetworkNames /></span> network. Always ensure that the address
							you are sending crypto to fully matches the one displayed in the app.
						</p>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Card>

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

	<div class="text-center flex flex-col gap-3 items-center">
		<p class="font-bold">Your Ambos Wallet Address</p>
		<p class="text-sm">Send ETH to your Ambos Wallet</p>
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
			<p class="bg-white text-xs text-muted-foreground h-5 w-5 z-10 transform translate-y-0.5">
				or
			</p>
		</div>
		<canvas id="canvas" class={blurClass + ' h-32 w-32 '}>Scan QR Code</canvas>
		<Button disabled={!checked} class="w-11/12 rounded-lg" on:click={setVerifying}
			>Verify Sent ETH</Button
		>
		<Button variant="link" class="-mt-3">
			<a class="w-full" href={AMBOS_FAQ} target="_blank">
				For doubts or issues, see our Help Section</a
			></Button
		>
	</div>
</Card>
