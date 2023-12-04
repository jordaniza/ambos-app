<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { ExternalLink, HelpCircle } from 'lucide-svelte';
	import TopBar from '../dashboard/top-bar.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import Logout from '$lib/components/connect/logout.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import { onMount } from 'svelte';
	import type { EthereumAddress } from '$lib/utils';

	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();
	let showHelpModal = false;
	let code = '';
	let existingCode = '';
	let submitting = false;
	let submittingFeedback = false;
	let feedback = '';
	let validCodes: string[] = [];

	$: address = $accountStore.address;
	$: shortAddress = address?.slice(0, 6) + '...' + address?.slice(-4);
	$: chainId = $web3Store.chainId ?? 1;
	$: explorerURL = BLOCK_EXPLORER_URLS[chainId] + '/address/' + address;
	$: codeValid = validCodes.includes(code);

	async function handleSubmitFeedback() {
		submittingFeedback = true;
		try {
			if (feedback && address) {
				const response = await fetch('/api/feedback', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ feedback, scw: address })
				});
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				if (response.status === 200) {
					toast.success('Feedback submitted successfully');
					feedback = '';
				}
			}
		} catch (e) {
			console.error(e);
			toast.error('Failed to submit feedback');
		} finally {
			submittingFeedback = false;
		}
	}

	async function fetchReferralCode(scw: string): Promise<string | null> {
		try {
			const response = await fetch(`/api/referral?scw=${encodeURIComponent(scw)}`);
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
			const response = await fetch(`/api/codes`);
			console.log(response);
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

	async function handleSubmitCode() {
		if (!code || !address) return;

		submitting = true;
		try {
			const response = await fetch('/api/referral', {
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
			fetchReferralCode(address).then((fetched) => {
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
				console.log(validCodes);
			})
			.catch((e) => {
				console.warn(e);
			});
	});
</script>

<Dialog.Root bind:open={showHelpModal}>
	<Dialog.Content
		class="max-w-[90%] sm:max-w-[425px] flex flex-col gap-4 pb-10 pt-12 text-center bg-popover"
	>
		<div class="flex justify-center items-center py-1">
			<img src="/illustrations/with-you.png" alt="help" class="h-32 w-32" />
		</div>
		<h2 class="font-extrabold text-xl">Need Help?</h2>
		<p class="pb-2">
			For additional help, support or if you have any questions, please visit our <a
				href="https://discord.gg/X6bcuVdE6y"
				target="_blank"
				class="text-secondary">Discord</a
			> and someone from the team will be happy to assist you.
		</p>
	</Dialog.Content>
</Dialog.Root>

<TopBar page="Settings" />

<button
	on:click={() => (showHelpModal = true)}
	class="rounded-full absolute bottom-20 right-5 z-10 bg-secondary shadow-md p-1"
>
	<HelpCircle class="h-8 w-8 stroke-[1px] text-white" />
</button>
<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans.png')]"
	/>
	<div slot="header" class="flex flex-col items-center justify-center gap-2 pb-20">
		<h1 class="">{shortAddress}</h1>
		<button class="rounded-2xl bg-card-foreground opacity-80 text-sm px-3 py-1">
			<a href={explorerURL} class="w-full flex items-center gap-1" target="_blank">
				<p>View on Explorer</p>
				<ExternalLink class="h-3 w-3" />
			</a>
		</button>
	</div>

	<div slot="card" class="p-4 gap-5 flex flex-col">
		<Card variant="popover" class="flex flex-col gap-3 items-center p-4">
			<p class="text-start w-full font-bold">Got Feedback? We'd love to hear it.</p>
			<textarea
				bind:value={feedback}
				rows="5"
				class="w-full rounded-xl bg-popover border-muted-foreground border-[1px] p-1 text-sm px-3 py-1"
				placeholder="Enter your feedback here..."
			/>
			<Button
				variant="outline"
				on:click={handleSubmitFeedback}
				disabled={!feedback || submittingFeedback}
				class="w-full border-secondary text-secondary"
			>
				{#if submittingFeedback}
					<LoadingSpinner />
				{:else}
					Submit
				{/if}
			</Button>
		</Card>

		<Card variant="popover" class="flex flex-col gap-3 items-center p-4">
			<div class="w-full flex justify-apart items-center">
				<p class="text-start w-full font-bold">Referral Code</p>
				{#if existingCode}
					<p class="text-end w-full text-sm italic font-bold pr-2 text-secondary">
						{existingCode}
					</p>
				{/if}
			</div>
			<p class="text-muted-foreground text-xs">
				Entering your referral code will give a kickback to the person who referred you.
			</p>
			<div
				class="flex gap-2 border-[1px] p-1 rounded-xl border-muted-foreground w-full items-center"
			>
				<input
					type="text"
					placeholder={(existingCode ? 'Update ' : 'Enter ') + 'your referral code here...'}
					class="w-full rounded-xl text-sm px-3 py-1 outline-none"
					bind:value={code}
				/>
				<Button
					disabled={!codeValid || submitting}
					class="w-1/4 bg-foreground text-popover"
					on:click={handleSubmitCode}
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
		<Logout class="w-full bg-secondary text-popover border-[1px] mt-2" />
	</div>
</BaseScreen>
