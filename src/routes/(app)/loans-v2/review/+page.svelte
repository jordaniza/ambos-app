<script lang="ts">
	import Eth from '$lib/eth.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import BaseScreen from '$lib/components/ui/layout/baseScreen.svelte';
	import BackButton from '$lib/components/ui/back-button/back-button.svelte';
	import { InfoIcon } from 'lucide-svelte';
	import MultiSwitch from '$lib/components/ui/multi-switch/multi-switch.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import LoanStepper from '$lib/components/ui/stepper/loanStepper.svelte';
	import { ROUTES } from '$lib/constants';

	const steps = ['Calculate', 'Transfer ETH', 'Review Loan'];
	let checked: boolean = false;
</script>

<!-- <Faq /> -->
<BaseScreen>
	<div slot="header" class="pb-5">
		<BackButton backTo={ROUTES.DASHBOARD_V2} />
		<div class="pt-5 px-4">
			<h1 class="font-extrabold text-2xl pb-3 tracking-widest">Review Your Loan Details</h1>
			<p>Check all the details and get your loan now</p>
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
		<MultiSwitch items={['Transfer Ethereum', 'Buy Ethereum']} />

		<!-- Transfer Select Modal -->
		<Card class="bg-popover p-4 flex flex-col gap-5">
			<div class="flex flex-col gap-5">
				<p>Pick Your Transfer Option</p>
				<MultiSwitch items={['Manual', 'Wallet', 'Exchange']} />
				<!-- Network Warning -->
				<Card
					class="flex flex-col gap-3 items-center justify-between px-3 py-2 text-sm text-center"
				>
					<p class="w-full font-bold text-destructive">Network Caution!</p>
					<p class="w-full">
						Ensure you send ETH to the correct network to avoid irreversible loss of funds!
					</p>
					<div class="flex items-center space-x-2 pb-2">
						<Label
							for="terms"
							class="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							I acknowledge the network details.
						</Label>
						<Checkbox id="terms" bind:checked />
					</div>
				</Card>
			</div>

			<!-- Ambos wallet address -->
			<div class="text-center flex flex-col gap-3 items-center">
				<p class="font-bold">Your Ambos Wallet Address</p>
				<p class="text-sm">Send ETH to your Ambos Wallet</p>
				<p class="border-secondary rounded-xl border p-2 w-full text-sm">0x0a4d...a7f2</p>
				<Button variant="secondary" class="px-5 py-0">Copy Address</Button>
				<div class="relative flex items-center justify-center w-full text-center">
					<div class="absolute w-11/12 h-[1px] top-1/2 bg-accent-foreground" />
					<p class="bg-white text-xs text-muted-foreground h-5 w-5 z-10 transform translate-y-0.5">
						or
					</p>
				</div>
				<p>Scan QR Code</p>
				<div class="h-32 w-32 border-black border-2" />
				<Button class="w-11/12 rounded-lg">Verify Sent ETH</Button>
				<Button variant="link" class="-mt-3">For doubts or issues, see our Help Section</Button>
			</div>
		</Card>
	</div>
</BaseScreen>
