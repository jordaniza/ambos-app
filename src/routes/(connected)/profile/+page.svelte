<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import { ExternalLink } from 'lucide-svelte';
	import TopBar from '../dashboard/top-bar.svelte';
	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import Logout from '$lib/components/connect/logout.svelte';

	let web3Store = getWeb3Store();
	let accountStore = getAccountStore();

	$: address = $accountStore.address;
	$: shortAddress = address?.slice(0, 6) + '...' + address?.slice(-4);
	$: chainId = $web3Store.chainId ?? 1;
	$: explorerURL = BLOCK_EXPLORER_URLS[chainId] + '/address/' + address;
</script>

<!-- <Faq /> -->
<TopBar page="Profile" />
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
		<Card variant="popover" class="flex flex-col gap-5 items-center p-4">
			<p class="text-start w-full font-bold">Settings</p>
			<Logout class="w-full bg-transparent border-secondary text-secondary border-[1px]" />
		</Card>
		<!-- <Card variant="popover" class="flex flex-col gap-5 items-center p-4">
			<p class="font-bold w-full text-start">Got Feedback? We'd love to hear it</p>
			<textarea
				class="w-full text-sm text-s rounded-2xl border-[1px] border-muted p-2 min-h-[150px] outline-none"
				placeholder="Write your feedback here..."
			/>
		</Card> -->
	</div>
</BaseScreen>
