<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { e, f } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ROUTES } from '$lib/constants';
	import { goto } from '$app/navigation';
	import { CheckCircle2 } from 'lucide-svelte';
	import Counter from '$lib/components/ui/counter/counter.svelte';
	import { getWeb3Store } from '$lib/context/getStores';

	export let open = true;
	export let repaymentQty: number;

	let web3Store = getWeb3Store();

	$: usdcBalance = $web3Store.balances['USDC'].small ?? 0;

	function handleGoBack() {
		open = false;
		goto(ROUTES.LOANS_V2);
	}
</script>

<!-- Repay from Wallet -->
<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Repayment Successful</Dialog.Title>

		<Counter
			target={repaymentQty}
			formatter={(value) => `-${e(value)} USDC`}
			show={true}
			class="text-secondary text-center text-2xl"
		/>
		<CheckCircle2 class="h-20 w-20 text-primary mx-auto stroke-1" />
		<!-- Wallet balance and 'credit card' -->
		<Card
			class="p-6 text-popover bg-[url('/backgrounds/card-dashboard-stable.png')] bg-cover rounded-3xl flex flex-col gap-3"
		>
			<div class="w-full flex justify-between">
				<div class=" rounded-xl">
					<p class="font-extrabold text-lg">USDC</p>
					<p class="text-sm font-extralight text-muted">Your Ambos Wallet</p>
				</div>
				<div class="flex flex-col items-end justify-between">
					<div class="h-10 w-10 bg-popover flex items-center justify-center rounded-full">
						<img src={`/external/usdc.png`} alt={'usdc'} class="h-8 w-8" />
					</div>
				</div>
			</div>
			<div class="w-full flex justify-between items-center">
				<p class="text-2xl">{e(usdcBalance)} USDC</p>
				<Counter
					target={repaymentQty}
					formatter={(value) => `-${e(value)} USDC`}
					show={true}
					class="text-background text-center text-xl"
				/>
			</div>
		</Card>
		<div class="flex flex-col gap-5 text-sm">
			<div class="flex flex-col text-base gap-2">
				<div class="flex justify-between">
					<p>Outstanding Amount:</p>
					<p class="text-secondary">{f(1000)}</p>
				</div>
				<div class="flex justify-between">
					<p>Interest:</p>
					<p class="text-secondary">{f(500)}</p>
				</div>
			</div>
		</div>
		<Button
			variant="outline"
			class="mb-2 mt-1 w-full border-secondary text-secondary"
			on:click={handleGoBack}>Back to Loans</Button
		>
	</Dialog.FlyInContent>
</Dialog.Root>
