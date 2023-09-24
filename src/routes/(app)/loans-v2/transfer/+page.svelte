<script lang="ts">
	import Eth from '$lib/eth.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import MultiSwitch from '$lib/components/ui/multi-switch/multi-switch.svelte';
	import LoanStepper from '$lib/components/ui/stepper/loanStepper.svelte';
	import { InfoIcon } from 'lucide-svelte';
	import { ROUTES } from '$lib/constants';
	import Transfer from './transfer/transfer.svelte';
</script>

<!-- <Faq /> -->
<BaseScreen>
	<div slot="header" class="pb-5">
		<BackButton backTo={ROUTES.DASHBOARD_V2} />
		<div class="pt-5 px-4">
			<h1 class="font-extrabold text-2xl pb-3 tracking-widest">Transfer Your ETH Securely</h1>
			<p>Transfer your ETH securely to proceed with your loan application</p>
		</div>
	</div>
	<div slot="card" class="p-4 flex flex-col gap-5 pb-20">
		<LoanStepper />

		<Card>
			<Card class="bg-popover p-4 flex flex-col gap-4">
				<!-- ETH Summary -->
				<Card class="bg-background rounded-xl py-2 px-4 flex flex-col gap-2">
					<div class="w-full flex justify-between">
						<div class=" rounded-xl">
							<p class="font-extrabold">ETH</p>
							<p class="text-sm text-secondary">Your Ambos Wallet</p>
						</div>
						<div class="h-10 w-10 bg-popover p-2 rounded-lg">
							<Eth />
						</div>
					</div>
					<p class="text-xl">0.152 ETH</p>
				</Card>
				<!-- Transfer Widget -->
				<div class="flex flex-col gap-3">
					<div class="w-full flex justify-between font-bold tracking-wide">
						<p>Amount to transfer</p>
						<p class="text-secondary">Edit</p>
					</div>
					<div class="border border-secondary p-1 rounded-xl flex">
						<input type="number" class="w-full px-4 py-2 font-bold mr-2 text-sm" />
						<Button variant="secondary" class="px-5">Copy</Button>
					</div>
					<Card class="flex justify-between px-3 py-2 text-sm">
						<div class="flex items-center">
							<div class="h-8 w-8 pt-1">
								<Eth />
							</div>
							<p class="pl-2 font-bold">Network</p>
						</div>
						<div class="flex items-center justify-end gap-2">
							<p>Ethereum</p>
							<InfoIcon class="h-4 w-4 text-muted-foreground" />
						</div></Card
					>
				</div></Card
			>
		</Card>
		<Transfer />
	</div>
</BaseScreen>
