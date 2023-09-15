<script lang="ts">
	import type Onboard from '@web3-onboard/core';
	import * as Table from '$lib/components/ui/table';
	import {
		fetchOnChainBalances,
		TARGET_CHAIN_ID,
		type NetworkBalance,
		getName,
		initProvidersForChains,
		type ProviderByChain
	} from './bridge';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		SourceRouter,
		checkLayerZeroMessageStatus,
		getStargateRoutersForChain,
		previewNetworkFeeSwap
	} from '$lib/components/bridge';
	import { N, type EthereumAddress } from '$lib/utils';
	import { ethers, type BigNumber } from 'ethers';
	import { onDestroy, onMount } from 'svelte';
	import { setupWallet } from './wallet';
	import {
		TX_STATES_SUMMARY,
		getLatestTransactionOfType,
		type TXState
	} from '$stores/transactions/state';
	import { getTxStore } from '$lib/context/getStores';
	import { toast } from 'svelte-sonner';
	import { bridgeETH } from '$stores/transactions/actions';
	import type { Message } from '@layerzerolabs/scan-client';

	// state
	let wallet: ReturnType<typeof Onboard> | undefined = undefined;
	let balances: NetworkBalance[] = [];
	let providers: ProviderByChain[];
	let fee: BigNumber;
	let txStore = getTxStore();
	let isPending = false;
	let intervalLZero: NodeJS.Timeout | undefined = undefined;
	let intervalBalances: NodeJS.Timeout | undefined = undefined;

	// reactive vars
	$: walletSubscription = wallet && wallet.state.select('wallets');
	$: connectedAccount = $walletSubscription?.[0]?.accounts?.[0];
	$: totalBalance = balances.reduce((acc, { balance }) => Number(balance.small) + acc, 0);
	$: hasEth = totalBalance > 0.05;
	$: orderedBalances = balances.sort((a, b) => Number(b.balance.small) - Number(a.balance.small));
	$: highestBalance = orderedBalances[0];
	$: highestBalanceInTargetNetwork = highestBalance?.chainId === TARGET_CHAIN_ID;
	$: transaction = getLatestTransactionOfType($txStore, 'BRIDGE_ETH');
	$: state = transaction?.state;
	$: seen = transaction?.seen;

	$: xChainTransactions = Object.entries($txStore.transactions).filter(
		([_, tx]) => tx.txType === 'BRIDGE_ETH'
	);

	$: {
		if (connectedAccount?.address && balances.length === 0) {
			checkXChainBalances();
		}
	}

	let xChainMessages: Message[] = [];

	function checkLayerZero() {
		console.log('CL0');
		const promises = xChainTransactions.map(([_, tx]) => {
			if (tx.finalTxHash) return checkLayerZeroMessageStatus(tx.finalTxHash);
		});

		console.log('CL0');
		console.log(promises);
		Promise.all(promises).then((p) => {
			const allMessages = p.filter(Boolean);

			if (!allMessages || allMessages.length === 0) return;
			// xChainMessages = allMessages.map((m) => m && m[0]);
			console.log(xChainMessages, allMessages);
		});
	}

	function watchLayerZeroOnInterval() {
		const timer = 10_000;
		checkLayerZero();
		return setInterval(() => {
			console.log(`checking layer zero status after ${timer / 1000} seconds`);
			checkLayerZero();
		}, timer);
	}

	function checkXChainBalances() {
		if (!providers || providers.length === 0) {
			providers = initProvidersForChains();
		}
		if (!connectedAccount) {
			return;
		}
		fetchOnChainBalances(connectedAccount.address, providers).then((res) => {
			balances = res;
		});
	}

	function watchXChainBalances() {
		const timer = 10_000;
		checkXChainBalances();
		return setInterval(() => {
			console.log(`checking xchain balances after ${timer / 1000} seconds`);
			checkXChainBalances();
		}, timer);
	}

	$: if (state !== undefined) {
		// update the notification
		const [message, showToast] = updateMessage(state, seen);
		if (message && showToast) {
			toast(message);
		}

		// the state should be loading while pending
		if (TX_STATES_SUMMARY['PENDING'].includes(state)) {
			isPending = true;
		} else {
			isPending = false;
		}
	}

	function updateMessage(state: TXState, seen: boolean | undefined): [string, boolean] {
		if (seen) return ['', false];
		switch (state) {
			case 'STARTED':
				return ['Bridging ETH.', false];
			case 'SIGNING':
				return ['Awaiting Signature', true];
			case 'SIGNED':
				return ['Requested, please wait for funds to arrive', true];
			case 'FAILED':
			case 'REJECTED':
				return ['There was a problem requesting you ETH.', true];
			case 'SUCCESSFUL':
				return [`Sent ETH for bridging.`, true];
			default:
				return ['', false];
		}
	}
	// lifecycle
	onMount(() => {
		wallet = setupWallet();
		walletSubscription = wallet?.state.select('wallets');
		intervalLZero = watchLayerZeroOnInterval();
		intervalBalances = watchXChainBalances();
	});

	onDestroy(() => {
		[intervalLZero, intervalBalances].forEach(clearInterval);
	});

	// methods
	const disconnect = () => {
		if (!wallet || !$walletSubscription) return;
		wallet.disconnectWallet({
			label: $walletSubscription[0].label
		});
	};

	const connect = async () => {
		if (!wallet) return;
		await wallet.connectWallet();
	};

	const formatBalance = (bal: string) =>
		Number(bal) > 0.05 || Number(bal) === 0 ? Number(bal).toFixed(2) : '< 0.05';

	function initSourceRouter() {
		if (!connectedAccount) {
			throw new Error('No connected account');
		}
		if (!highestBalance) {
			throw new Error('No highest balance');
		}
		if (!$walletSubscription) {
			throw new Error(`Wallet not found`);
		}
		return new SourceRouter(
			highestBalance.chainId,
			new ethers.providers.Web3Provider($walletSubscription[0].provider, 'any')
		);
	}

	function checkFee() {
		if (!connectedAccount) {
			throw new Error('No connected account');
		}

		const highestBalanceProivder = providers.find((p) => p.chainId === highestBalance.chainId);

		if (!highestBalanceProivder) {
			throw new Error('No provider found');
		}

		const [router, _] = getStargateRoutersForChain(
			highestBalance.chainId,
			highestBalanceProivder.provider
		);

		previewNetworkFeeSwap(
			router,
			TARGET_CHAIN_ID,
			connectedAccount.address as EthereumAddress
		).then((res) => {
			fee = res;
		});
	}

	async function bridge() {
		if (!connectedAccount || !$walletSubscription || !wallet) {
			throw new Error('No connected account');
		}

		const currentlyConnectedChain = Number($walletSubscription[0].chains?.[0].id ?? 0);

		if (currentlyConnectedChain !== highestBalance.chainId) {
			try {
				await wallet.setChain({ chainId: `0x${highestBalance.chainId.toString(16)}` });
			} catch (e) {
				console.error('ERROR SETTING CHAIN', e);
				return;
			}
		}

		const sourceRouter = initSourceRouter();

		try {
			await bridgeETH({
				store: txStore,
				amount: ethers.utils.parseEther('0.1'),
				sourceRouter,
				dstChainId: TARGET_CHAIN_ID,
				fromAddress: connectedAccount.address as EthereumAddress,
				toAddress: connectedAccount.address as EthereumAddress,
				minAmount: ethers.utils.parseEther('0.095')
			});
		} catch (e) {
			console.error('ERROR BRIDGING', e);
		}
	}
</script>

<!-- Connect to a wallet -->
<section>
	<h1>Welcome to the Bridging App</h1>
	{#if connectedAccount}
		<div class="wallet">
			<div>
				<div>{connectedAccount.address}</div>
			</div>
			<button on:click={disconnect}>Disconnect</button>
		</div>
	{:else}
		<div>
			<button on:click={connect}>Connect</button>
		</div>
	{/if}
</section>

<!-- Do a multichain balance scan across all the providers -->
{#if connectedAccount}
	<section>
		<h2>Balances</h2>
		<div>
			<Table.Root
				>TARGET_CHAIN_ID
				<Table.Header
					>TARGET_CHAIN_ID
					<Table.Row>
						<Table.Head>Network</Table.Head>
						<Table.Head>Balance</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each balances as { chainId, balance }}
						{#if Number(balance.small) > 0 || chainId === TARGET_CHAIN_ID}
							<Table.Row class={chainId === TARGET_CHAIN_ID ? 'text-orange-500 font-bold' : ''}>
								<Table.Cell>{getName(chainId)}</Table.Cell>
								<Table.Cell>{formatBalance(balance.small)}</Table.Cell>
							</Table.Row>
						{/if}
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
		{#if hasEth && highestBalanceInTargetNetwork}
			<p>YOU ARE RICH</p>
		{:else if hasEth && !highestBalanceInTargetNetwork}
			<p>YOU ARE RICH BUT NOT ON THE TARGET NETWORK</p>
			<p>Let's get your funds to the target network</p>
			<p>
				We want to move {formatBalance(highestBalance.balance.small)} ETH from {getName(
					highestBalance.chainId
				)}
				to {getName(TARGET_CHAIN_ID)}
			</p>
			<Button variant="secondary" on:click={checkFee}>Quote Fee</Button>
			{#if fee}
				<p>Fee To Bridge: {N(fee)} ETH</p>
				<Button on:click={bridge}>Okay?</Button>
			{/if}
		{:else}
			<p>YOU ARE POOR</p>
		{/if}
	</section>
{/if}
<!-- SECTION FOR XCHAIN TRANSACTIONS -->
<section class="p-4">
	<h1 class="text-center mb-5 font-bold">Your XChain Transaction History</h1>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head><div>Updated</div></Table.Head>
				<Table.Head><div>Transaction</div></Table.Head>
				<Table.Head><div>Status</div></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body class="text-center">
			{#if xChainTransactions}
				{#each xChainTransactions as [id, tx]}
					<Table.Row>
						<Table.Cell class="relative">
							{new Date(tx.updatedOn).toLocaleDateString()}
						</Table.Cell>
						<Table.Cell>proper(tx.txType)</Table.Cell>
						<Table.Cell>delldfl</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={3}>No transactions found</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</section>
