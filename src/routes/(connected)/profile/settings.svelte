<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import { API_ROUTES } from '$lib/constants';
	import { getAccountStore } from '$lib/context/getStores';
	import type { EthereumAddress } from '$lib/utils';
	import { ChevronRightIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let accountStore = getAccountStore();
	let submitting = false;

	$: address = $accountStore.address;
	$: username = $accountStore.username;
	$: disabled = submitting || !pendingUsername || pendingUsername === username;

	let pendingUsername: string | null = null;

	async function updateUsername(
		username: string,
		scw: EthereumAddress,
		patchOrPost: 'PATCH' | 'POST'
	) {
		try {
			const response = await fetch(API_ROUTES[patchOrPost].USER, {
				method: patchOrPost,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, scw })
			});
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			return response.status;
		} catch (error) {
			console.warn('Failed to update username:', error);
		}
	}

	async function handleSubmitUsername() {
		if (!pendingUsername || !address) return;

		try {
			submitting = true;
			const patchOrPost = username ? 'PATCH' : 'POST';
			const result = await updateUsername(pendingUsername, address, patchOrPost);
			if (result !== 200) throw new Error('Failed to update username');

			accountStore.update((s) => {
				s.username = pendingUsername!;
				return s;
			});
			toast.success('Username updated successfully');
		} catch (error) {
			console.warn('Failed to update username:', error);
			toast.error('Failed to update username');
		} finally {
			submitting = false;
		}
	}
</script>

<Card variant="popover" class="flex flex-col gap-3 items-center p-4">
	<p class=" w-full text-start text-sm font-bold">Settings</p>
	<p class="text-start text-xs w-full pl-1">Username</p>
	<div class="flex gap-2 border-[1px] p-1 rounded-xl border-muted-foreground w-full items-center">
		<input
			type="text"
			placeholder={username ?? 'Username...'}
			class="w-full rounded-xl text-sm px-3 py-1 outline-none"
			bind:value={pendingUsername}
		/>
		<button
			{disabled}
			class="bg-background shadow-xs p-1 text-popover rounded-full"
			on:click={handleSubmitUsername}
		>
			{#if submitting}
				<LoadingSpinner class={'h-4 w-4 animate-spin text-secondary'} />
			{:else}
				<ChevronRightIcon class={'h-4 w-4 ' + (disabled ? ' text-popover' : 'text-secondary')} />
			{/if}
		</button>
	</div>
</Card>
