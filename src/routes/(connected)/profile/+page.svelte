<script lang="ts">
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { Divide, ExternalLink, HelpCircle } from 'lucide-svelte';
	import TopBar from '../dashboard/top-bar.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import Logout from '$lib/components/connect/logout.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Feedback from './feedback.svelte';
	import Referrals from './referrals.svelte';
	import Settings from './settings.svelte';
	import Tasks from './tasks.svelte';

	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();
	let showHelpModal = false;

	$: address = $accountStore.address;
	$: username = $accountStore.username;
	$: shortAddress = address?.slice(0, 6) + '...' + address?.slice(-4);
	$: chainId = $web3Store.chainId ?? 1;
	$: explorerURL = BLOCK_EXPLORER_URLS[chainId] + '/address/' + address;
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

<TopBar page="Profile" />

<button
	on:click={() => (showHelpModal = true)}
	class="rounded-full fixed bottom-20 right-5 z-10 bg-secondary shadow-lg p-1"
>
	<HelpCircle class="h-8 w-8 stroke-[1px] text-white" />
</button>

<BaseScreen>
	<div
		slot="background"
		class="w-full h-full bg-contain bg-top bg-[url('/backgrounds/loans.png')]"
	/>
	<div slot="header" class="flex flex-col items-center justify-center gap-2 pb-20">
		<h1 class="">{username ?? shortAddress}</h1>
		<button class="rounded-2xl bg-card-foreground opacity-80 text-sm px-3 py-1">
			<a href={explorerURL} class="w-full flex items-center gap-1" target="_blank">
				<p>View on Explorer</p>
				<ExternalLink class="h-3 w-3" />
			</a>
		</button>
	</div>

	<div slot="card" class="p-4 gap-5 flex flex-col">
		<Settings />
		<Tasks />
		<Feedback />
		<Referrals />
		<Logout class="w-full bg-secondary text-popover border-[1px] mt-2" />
		<div class="h-24" />
	</div>
</BaseScreen>
