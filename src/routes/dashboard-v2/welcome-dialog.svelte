<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ROUTES } from '$lib/constants';
	import { onMount } from 'svelte';

	export let startOpen = true;
	let isOpen: boolean;

	const close = () => (isOpen = false);
	const open = () => (isOpen = true);

	function openAfterTimeout() {
		if (startOpen) setTimeout(() => open(), 1000);
	}

	onMount(() => openAfterTimeout());
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content
		class="max-w-[90%] sm:max-w-[425px] flex flex-col gap-4 pb-10 pt-12 text-center bg-popover"
	>
		<div class="flex justify-center items-center py-1">
			<div class="h-32 w-32 bg-gray-200 rounded-full" />
		</div>
		<h2 class="font-extrabold text-xl">Welcome to Ambos Finance!</h2>
		<p class="pb-2">
			Discover the easiest way to unlock the value of your Ethereum without selling. Choose the
			guided experience for a seamless loan process or jump straight into the app. Your financial
			superpower awaits!
		</p>
		<Button class="rounded-lg">
			<a href={ROUTES.NEW_LOAN} class="w-full"> Get your loan </a>
		</Button>
		<Button class="rounded-lg bg-popover" variant="outline" on:click={close}>Go to app</Button>
		<Button variant="link" class="text-secondary underline underline-offset-1 font-semibold"
			>Learn more</Button
		>
	</Dialog.Content>
</Dialog.Root>
