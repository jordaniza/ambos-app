<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import { onMount } from 'svelte';
	import { API_ROUTES } from '$lib/constants';

	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();
	let code = '';
	let existingCode = '';
	let submitting = false;
	let validCodes: string[] = [];

	$: address = $accountStore.address;
	$: codeValid = validCodes.includes(code);

	async function fetchReferral(scw: string): Promise<string | null> {
		try {
			const response = await fetch(`${API_ROUTES.GET.REFERRAL}?scw=${encodeURIComponent(scw)}`);
			if (!response.ok && response.status !== 404) {
				throw new Error(`Error: ${response.statusText}`);
			} else if (response.status === 404) {
				return null;
			}
			const data = await response.json();
			return data.referralCode;
		} catch (error) {
			console.warn('Failed to fetch referral code:', error);
			return null;
		}
	}

	async function getValidReferralCodes(): Promise<{ codes: string[] } | []> {
		try {
			const response = await fetch(API_ROUTES.GET.REFERRAL_CODES);
			if (!response.ok) {
				if (response.status === 404) return [];
				throw new Error(`Error: ${response.statusText}`);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.warn('Failed to fetch referral codes:', error);
			return [];
		}
	}

	async function handleSubmitReferral() {
		if (!code || !address) return;

		submitting = true;
		try {
			const response = await fetch(API_ROUTES.POST.REFERRAL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ scw: address, referralCode: code })
			});
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			if (response.status === 200) {
				toast.success('Referral code submitted successfully');
				existingCode = code;
				code = '';
			}
		} catch (error) {
			console.error('Failed to submit referral code:', error);
			toast.error('Failed to submit referral code');
		} finally {
			submitting = false;
		}
	}

	$: {
		if (address && !existingCode) {
			fetchReferral(address).then((fetched) => {
				if (fetched) existingCode = fetched;
			});
		}
	}

	onMount(() => {
		getValidReferralCodes()
			.then((data) => {
				if (!data) throw new Error('Failed to fetch valid referral codes');
				if (!('codes' in data)) throw new Error('Failed to fetch valid referral codes');
				const codes = data.codes;
				if (codes && codes.length > 0) validCodes = codes;
				else {
					throw new Error('Failed to fetch valid referral codes');
				}
			})
			.catch((e) => {
				console.warn(e);
			});
	});
</script>

<Card variant="popover" class="flex flex-col gap-3 items-center p-4">
	<div class="w-full flex justify-apart items-center">
		<p class="text-start w-full font-bold text-sm">Referral Code</p>
		{#if existingCode}
			<p class="text-end w-full text-sm italic font-bold pr-2 text-secondary">
				{existingCode}
			</p>
		{/if}
	</div>
	<p class="text-muted-foreground text-xs">
		Entering your referral code will give a kickback to the person who referred you.
	</p>
	<div class="flex gap-2 border-[1px] p-1 rounded-xl border-muted w-full items-center">
		<input
			type="text"
			placeholder={(existingCode ? 'Update ' : 'Enter ') + 'your referral code here...'}
			class="w-full rounded-xl text-sm px-3 py-1 outline-none"
			bind:value={code}
		/>
		<Button
			disabled={!codeValid || submitting}
			class="w-1/4 bg-foreground text-popover"
			on:click={handleSubmitReferral}
		>
			{#if submitting}
				<LoadingSpinner />
			{:else}
				{existingCode ? 'Update' : 'Submit'}
			{/if}
		</Button>
	</div>
	{#if code && !codeValid}
		<p class="text-sm text-destructive">Invalid code</p>
	{/if}
</Card>
