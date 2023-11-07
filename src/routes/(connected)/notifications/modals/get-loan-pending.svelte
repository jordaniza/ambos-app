<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import UsdcWalletCard from '$lib/components/wallet-cards/usdc-wallet-card.svelte';
	import { ROUTES } from '$lib/constants';

	export let open: boolean;

	function handleGoToHome() {
		open = false;
		goto(ROUTES.DASHBOARD_V2);
	}
</script>

<!-- Repay from Wallet -->
<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Processing your Loan</Dialog.Title>
		<div class="flex flex-col gap-5 w-full items-center justify-center">
			<div class="h-20 w-20 flex justify-center items-center relative">
				<div class="absolute h-14 w-14 rounded-full bg-popover z-10" />
				<div class="absolute h-16 w-16 rounded-full bg-secondary opacity-10" />
				<LoadingSpinner
					class="absolute h-20 w-20 animate-spin text-secondary z-20 font-thin stroke-1"
				/>
			</div>
			<div class="flex flex-col w-full items-center text-center gap-3">
				<p>You're almost done!<br />We're waiting for your loan to be confirmed.</p>
				<Separator />
				<p class="text-muted-foreground">
					We will send you a notification once your USDC has arrived.
				</p>
				<div class="w-full text-start py-1">
					<UsdcWalletCard />
				</div>
				<Button
					variant="outline"
					class="mb-2 mt-1 w-full border-secondary text-secondary"
					on:click={handleGoToHome}>Back to the app</Button
				>
			</div>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
