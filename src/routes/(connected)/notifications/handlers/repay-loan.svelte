<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ROUTES } from '$lib/constants';
	import type { TXDetail, TxContext } from '$stores/transactions/state';
	import { toast } from 'svelte-sonner';
	import RepayLoanSuccess from '../modals/repay-loan-success.svelte';

	export let tx: TXDetail;
	let showSuccessModal = false;
	let showPendingModal = false;

	$: context = tx?.context as TxContext['DECREASE_DEBT'] | undefined;
	$: state = tx?.state;
	$: repaymentQty = context?.amount ?? 0;

	$: if (state !== undefined) {
		switch (state) {
			case 'SIGNING':
				toast.info('Awaiting Signature');
				break;
			case 'SIGNED':
				showPendingModal = true;
				break;
			case 'SUCCESSFUL':
				showPendingModal = false;
				showSuccessModal = true;
				break;
			case 'REJECTED':
			case 'FAILED':
				toast.error('Repayment failed');
			default:
				break;
		}
	}

	function handleGoBack() {
		showPendingModal = false;
		showSuccessModal = false;
		goto(ROUTES.LOANS_V2);
	}
</script>

<RepayLoanSuccess open={showSuccessModal} {repaymentQty} />

<!-- Repay from Wallet -->
<Dialog.Root bind:open={showPendingModal}>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">Repaying Your Loan</Dialog.Title>
		<div class="flex flex-col gap-5 w-full items-center justify-center">
			<div class="h-20 w-20 flex justify-center items-center relative">
				<div class="absolute h-14 w-14 rounded-full bg-popover z-10" />
				<div class="absolute h-16 w-16 rounded-full bg-secondary opacity-10" />
				<LoadingSpinner
					class="absolute h-20 w-20 animate-spin text-secondary z-20 font-thin stroke-1"
				/>
			</div>
			<div class="flex flex-col w-full items-center text-center gap-3">
				<p>You're almost done!<br />We're waiting for your loan to be repaid.</p>
				<Separator />
				<p class="text-muted-foreground">
					We will send you a notification once your ETH has arrived.
				</p>
				<Button
					variant="outline"
					class="mb-2 mt-1 w-full border-secondary text-secondary"
					on:click={handleGoBack}>Back to Loans</Button
				>
			</div>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
