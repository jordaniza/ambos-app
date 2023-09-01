<script lang="ts">
	import { APP_NAME } from '$lib/constants';
	import { BLOCK_EXPLORER_URLS } from '$lib/contracts';
	import type { EthereumAddress } from '$lib/utils';
	import { accountStore } from '$stores/account';
	import { ChainId } from '@biconomy/core-types';
	import PersonIcon from 'svelte-icons/io/IoMdPerson.svelte';
	import ClipboardCopyIcon from 'svelte-icons/io/IoMdClipboard.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';

	let isCopied = false;
	let chainId = ChainId.POLYGON_MUMBAI;

	$: address = $accountStore?.address;
	const truncateAddress = (address?: EthereumAddress) => {
		if (!address) return 'Address goes here...';
		return `${address.slice(0, 10)}...${address.slice(-8)}`;
	};
	$: truncatedAddress = truncateAddress(address);

	const handleCopyClick = async (address?: EthereumAddress) => {
		if (!address) return;
		await navigator.clipboard.writeText(address);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, 2000);
	};
</script>

<section class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
	<Card class={cn('w-full')}>
		<CardHeader>
			<div class="flex items-center">
				<div class="h-8 w-8 mr-2">
					<PersonIcon class="w-8 h-8 mr-2" />
				</div>
				<CardTitle>Your Profile</CardTitle>
			</div>
		</CardHeader>
		<Separator class="mb-5" />
		<CardContent class="">
			<section class="flex flex-col justify-between">
				<p>
					On this page you'll find some advanced details about your wallet on Ethereum.
					<br />
					<br />
					{APP_NAME}{' '}
					gives you complete control over your assets. The addresses listed below are soley controlled
					by you, as is all the money in your wallet.
				</p>
				<div class="flex flex-col mt-5">
					<p class="my-5 font-bold">Your Ethereum Wallet:</p>
					<div class="flex justify-between items-center border p-2 rounded-md">
						<code class="font-mono ml-2">
							{truncatedAddress}
						</code>
						<Button
						variant="ghost"
                    on:click={() => handleCopyClick(address)}
						>
							<div class="h-8 w-8 mr-2">
								<ClipboardCopyIcon class="w-8 h-8 mr-2" />
							</div>
						</Button>
					</div>
					<p class="my-5">
						Your Ethereum wallet is a unique address on the Ethereum blockchain. This address is
						where your ETH and USDC will be stored.
						<br />
						<br />
						You can check out the transaction history at the link below.
					</p>
				</div>
				<Button class="mt-2" variant="outline">
					<a
						href={BLOCK_EXPLORER_URLS[chainId] + '/address/' + address}
						class="w-full"
						target="_blank">View on Explorer</a
					>
				</Button>
			</section>
		</CardContent>
	</Card>
</section>
