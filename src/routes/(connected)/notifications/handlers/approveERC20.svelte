<script lang="ts">
	import type { TSupportedTokens } from '$lib/contracts';
	import { e } from '$lib/utils';
	import type { TXDetail, TXState, TxContext } from '$stores/transactions/state';
	import { toast } from 'svelte-sonner';

	export let tx: TXDetail;

	let showSuccessModal = false;

	$: state = tx?.state;
	$: seen = tx?.seen;

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
				return ['Initiating approval', false, 'pending'];
			case 'SIGNING':
				return ['Awaiting Signature', true, 'pending'];
			case 'SIGNED':
				return ['Approval submitted, your approval is being processed', true, 'success'];
			case 'FAILED':
				return ['There was a problem processing your approval.', true, 'error'];
			case 'REJECTED':
				return ['Your approval failed', true, 'error'];
			case 'SUCCESSFUL':
				showSuccessModal = true;
				return [`Approval Complete`, true, 'success'];
			default:
				return ['', false, ''];
		}
	}
</script>
