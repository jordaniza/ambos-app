<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ROUTES } from '$lib/constants';
	import { getTxStore } from '$lib/context/getStores';
	import { setHasEth } from '$stores/transactions/builders';
	import { onMount } from 'svelte';

	export let startOpen = true;
	// exported prop
	export let openEthDialog = () => {
		ethDialog = true;
	};

	let welcomeDialog: boolean;
	let ethDialog: boolean;
	let txStore = getTxStore();

	const closeWelcomeDialog = () => {
		welcomeDialog = false;
	};
	const openWelcomeDialog = () => {
		welcomeDialog = true;
	};

	function openWelcomeAfterTimeout() {
		if (startOpen) {
			setTimeout(() => {
				openWelcomeDialog();
			}, 300);
		}
	}

	function handleEthDialog() {
		closeWelcomeDialog();
		openEthDialog();
	}

	function handleYesOwnsEth() {
		setHasEth(txStore, true);
		goto(ROUTES.LOANS_V2_CALCULATE);
	}

	function handleNoDoesNotOwnEth() {
		setHasEth(txStore, false);
		goto(ROUTES.LOANS_V2_CALCULATE);
	}

	onMount(() => openWelcomeAfterTimeout());
</script>

<Dialog.Root bind:open={welcomeDialog}>
	<Dialog.Content
		class="max-w-[90%] sm:max-w-[425px] flex flex-col gap-4 pb-10 pt-12 text-center bg-popover"
	>
		<div class="flex justify-center items-center py-1">
			<img src="/illustrations/crown.png" alt="coin" class="h-32 w-32" />
		</div>
		<h2 class="font-extrabold text-xl">Welcome to Ambos Finance!</h2>
		<p class="pb-2">
			Discover the easiest way to unlock the value of your Ethereum without selling. Choose the
			guided experience for a seamless loan process or jump straight into the app. Your financial
			superpower awaits!
		</p>
		<Button on:click={handleEthDialog} class="rounded-lg">Get your loan</Button>
		<Button class="rounded-lg bg-popover" variant="outline" on:click={closeWelcomeDialog}
			>Go to app</Button
		>
		<Button variant="link" class="text-secondary underline underline-offset-1 font-semibold"
			>Learn more</Button
		>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={ethDialog}>
	<Dialog.Content
		class="max-w-[90%] sm:max-w-[425px] flex flex-col gap-4 pb-10 pt-12 text-center bg-popover"
	>
		<div class="flex justify-center items-center py-1">
			<img src="/illustrations/coin.png" alt="coin" class="h-32 w-32" />
		</div>
		<h2 class="font-extrabold text-xl">Do you currently own ETH?</h2>
		<p class="pb-2">
			To customize your experience, we need to understand whether or not you own Ether (ETH). This
			can be in an Ethereum wallet or on an exchange.
		</p>
		<div class="flex w-full gap-3">
			<Button on:click={handleYesOwnsEth} class="rounded-lg bg-popover w-1/2" variant="outline"
				>Yes</Button
			>
			<Button
				on:click={handleNoDoesNotOwnEth}
				class="rounded-lg bg-popover w-1/2 text-secondary border-secondary"
				variant="outline">No</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>
