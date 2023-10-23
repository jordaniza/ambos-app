<script lang="ts">
	import { PUBLIC_WALLETCONNECT_PROJECT_ID } from '$env/static/public';
	import { getProvider, initConnectKit } from '$stores/account/particle';
	import { ChainId } from '@biconomy/core-types';
	import {
		evmInjectedWallet,
		evmWallets,
		getInjectedProvider,
		type EVMProvider,
		type ParticleConnect
	} from '@particle-network/connect';
	import { onDestroy, onMount } from 'svelte';
	import Wallet from '../loans/transfer/transfer/wallet.svelte';
	import { AuthTypes } from '@particle-network/auth';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ethers } from 'ethers';
	import { PolygonMumbai } from '@particle-network/chains';
	import type { EthereumAddress } from '$lib/utils';
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ChevronDown, MailIcon, PhoneIcon, SmartphoneIcon } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	let connectKit: ParticleConnect;
	let wallets: ReturnType<typeof evmWallets> = [];
	let socials = AuthTypes;
	let provider: ethers.providers.Web3Provider | undefined;
	let walletAddress: EthereumAddress | undefined;
	let chainId: number;
	let pending = false;
	let pendingCrypto = false;
	let selectCryptoWallet = false;
	let timedOut = false;

	$: {
		console.log('provider changes with wallet address', walletAddress);
		console.log({ provider });
	}

	function withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new Error('timeout'));
			}, timeout);

			promise
				.then((value) => {
					clearTimeout(timer);
					resolve(value);
				})
				.catch((reason) => {
					clearTimeout(timer);
					reject(reason);
				});
		});
	}

	onMount(() => {
		connectKit = initConnectKit(ChainId.POLYGON_MUMBAI);
		wallets = evmWallets({
			projectId: PUBLIC_WALLETCONNECT_PROJECT_ID
		});

		connectKit.on('connect', (p) => {
			const evmp = p as EVMProvider;
			connectKit.switchChain(PolygonMumbai);
			provider = new ethers.providers.Web3Provider(evmp, 'any');
			provider.getNetwork().then((network) => {
				chainId = network.chainId;
			});
			provider.listAccounts().then((accounts) => {
				walletAddress = accounts[0] as EthereumAddress;
			});
		});
	});

	function connectWithSocial(id?: (typeof AuthTypes)[number]) {
		const loginOptions = id
			? {
					preferredAuthType: id
			  }
			: undefined;

		pending = true;
		connectKit.particle.auth
			.login(loginOptions)
			.then((info) => {
				provider = getProvider(connectKit.particle);
				provider?.getNetwork().then((network) => {
					chainId = network.chainId;
				});
				walletAddress = info.wallets[0].public_address as EthereumAddress;
			})
			.finally(() => {
				pending = false;
			});
	}

	function handleConnectWithCrypto() {
		selectCryptoWallet = true;
	}

	async function handleConnect(id: string) {
		pendingCrypto = true;
		timedOut = false;
		withTimeout(
			connectKit.connect(id).then(() => {
				selectCryptoWallet = false;
			}),
			20_000
		)
			.catch(() => {
				timedOut = true;
			})
			.finally(() => {
				selectCryptoWallet = false;
				pendingCrypto = false;
			});
	}
</script>

{#if pending}
	<div class="absolute inset-0 flex items-center justify-center bg-black opacity-60">
		<div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
	</div>
{/if}

{#if walletAddress && chainId}
	<div
		class="bg-primary text-white flex items-center text-center justify-center w-full absolute top-0 p-2"
	>
		Connected to {walletAddress} on Chain {chainId}
	</div>
{:else if timedOut}
	<div
		class="bg-destructive text-white flex items-center text-center justify-center w-full absolute top-0 p-2"
	>
		There was an error connecting to your wallet. Please try again and ensure you can connect on
		your phone.
	</div>
{/if}

<div
	class="
  darken-login-bg
  flex flex-col items-center justify-between h-screen w-screen
"
>
	<div class="flex flex-col items-center justify-center h-1/2">
		<img src="/Logo-light-transparent.png" alt="Ambos Logo" class="h-36 w-36" />
		<div class="text-white text-center flex flex-col gap-3">
			<p class="font-bold text-2xl">Dive into DeFi Simplified</p>
			<p class="font-lg">
				Easy, secure and swift crypto loans.<br />Get cash now, without selling your crypto.
			</p>
		</div>
	</div>

	<div class="w-screen max-h-[50%]">
		<Card class="flex flex-col items-center p-6 px-8 gap-3 ">
			<div class="text-center">
				<p class="font-bold text-xl">Login</p>
				<p class="text-center px-6">Please choose how you would like to connect to Ambos</p>
			</div>
			<Button on:click={handleConnectWithCrypto} class="w-3/4">Use a Crypto Wallet</Button>

			<div class="relative w-full flex items-center justify-center">
				<div class="h-[0.5px] absolute bg-black w-8/12" />
				<div class="bg-card w-10 h-10 flex items-center justify-center z-10 rounded-full">or</div>
			</div>

			<div class="flex items-center justify-center gap-3">
				<button
					on:click={() => connectWithSocial('email')}
					class="h-10 w-10 flex items-center justify-center rounded-full bg-popover"
				>
					<MailIcon class="h-4 w-4" />
				</button>

				<button
					on:click={() => connectWithSocial('phone')}
					class="h-10 w-10 flex items-center justify-center rounded-full bg-popover"
				>
					<SmartphoneIcon class="h-4 w-4" />
				</button>

				<button
					on:click={() => connectWithSocial('apple')}
					class="h-10 w-10 flex items-center justify-center rounded-full bg-popover"
				>
					<img src="external/apple.png" alt="apple" class="h-8 w-8" />
				</button>

				<button
					on:click={() => connectWithSocial('google')}
					class="h-10 w-10 flex items-center justify-center rounded-full bg-popover"
				>
					<img src="external/google.png" alt="google" class="h-6 w-6" />
				</button>

				<button
					on:click={() => connectWithSocial()}
					class="h-10 w-10 flex items-center justify-center rounded-full bg-popover"
				>
					<ChevronDown class="h-5 w-5 stroke-2" />
				</button>
			</div>
		</Card>
	</div>
</div>

<Dialog.Root bind:open={selectCryptoWallet}>
	<Dialog.FlyInContent class="bg-popover">
		{#if pendingCrypto}
			<div class="absolute inset-0 flex items-center justify-center bg-black opacity-60">
				<div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
			</div>
		{/if}
		<Dialog.Title class="font-xl font-extrabold text-center"
			>Connect With a Crypto Wallet</Dialog.Title
		>

		<div class="w-full h-full flex items-center justify-center pt-6">
			<div class="grid grid-cols-3 gap-5">
				{#each wallets as wallet}
					<button
						on:click={() => handleConnect(wallet.id)}
						class="flex flex-col items-center justify-center gap-1"
					>
						<div class="h-12 w-12 bg-popover rounded-lg flex items-center justify-center">
							<img src={wallet.iconUrl} alt={wallet.name} class="h-8 w-8" />
						</div>
						<p class="text-sm">{wallet.name}</p>
					</button>
				{/each}
			</div>
		</div></Dialog.FlyInContent
	>
</Dialog.Root>

<style>
	:global(.darken-login-bg) {
		background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
			url('/backgrounds/login.jpeg');
		background-size: cover;
	}
</style>
