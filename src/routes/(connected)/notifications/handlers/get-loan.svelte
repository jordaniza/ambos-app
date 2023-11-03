<script lang="ts">
	import type { TXDetail, TXState, TxContext } from '$stores/transactions/state';
	import { toast } from 'svelte-sonner';
	import Success from '../modals/get-loan-success.svelte';
	import GetLoanPending from '../modals/get-loan-pending.svelte';

	export let tx: TXDetail;
	let showSuccessModal = false;
	let showPendingModal = false;

	$: state = tx?.state;
	$: seen = tx?.seen;
	$: context = tx?.context as TxContext['INCREASE_DEBT'] | undefined;
	$: borrowAmount = context?.usdToBorrow;
	$: ethSupplied = context?.ethToSupply;

	$: if (state !== undefined) {
		// update the notification
		const [message, showToast, typeToast] = updateMessage(state, seen);
		if (message && showToast) {
			switch (typeToast) {
				case 'error':
					toast.error(message);
					break;
				case 'success':
					toast.success(message);
					break;
				case 'pending':
					toast.info(message);
					break;
				default:
					toast(message);
					break;
			}
		}
	}

	function updateMessage(state: TXState, seen: boolean | undefined): [string, boolean, string] {
		if (seen) return ['', false, ''];
		switch (state) {
			case 'STARTED':
				return ['Started a new loan.', false, 'pending'];
			case 'SIGNING':
				return ['Awaiting Signature', true, 'pending'];
			case 'SIGNED':
				showPendingModal = true;
				return ['Loan submitted, your loan is being processed', false, 'success'];
			case 'FAILED':
				return ['There was a problem processing your loan.', true, 'error'];
			case 'REJECTED':
				return ['Your loan application was rejected', true, 'error'];
			case 'SUCCESSFUL':
				showPendingModal = false;
				showSuccessModal = true;
				return ['Success! Your loan has been processed successfully.', true, 'success'];
			default:
				return ['', false, ''];
		}
	}
</script>

<GetLoanPending open={showPendingModal} />
<Success {borrowAmount} open={showSuccessModal} {ethSupplied} />
