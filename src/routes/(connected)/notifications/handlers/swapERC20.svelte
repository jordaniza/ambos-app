<script lang="ts">
	import type { TXDetail, TXState, TxContext } from '$stores/transactions/state';
	import { ethers } from 'ethers';
	import { toast } from 'svelte-sonner';

	export let tx: TXDetail;

	let showSuccessModal = false;

	$: state = tx?.state;
	$: seen = tx?.seen;
	$: context = tx?.context as TxContext['SWAP_TOKEN'] | undefined;
	$: quote = context?.quote;

	$: inToken = context?.inToken;
	$: outToken = context?.outToken;

	$: inTokenQty = Number(
		ethers.utils.formatUnits(quote?.buyAmount ?? 0, inToken?.decimals ?? 18)
	).toFixed(6);
	$: outTokenQty = Number(
		ethers.utils.formatUnits(quote?.sellAmount ?? 0, outToken?.decimals ?? 18)
	).toFixed(6);

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
				return ['Initiating swap', false, 'pending'];
			case 'SIGNING':
				return ['Awaiting Signature', true, 'pending'];
			case 'SIGNED':
				return ['Swap submitted, your swap is being processed', true, 'success'];
			case 'FAILED':
				return ['There was a problem processing your swap.', true, 'error'];
			case 'REJECTED':
				return ['Swap failed', true, 'error'];
			case 'SUCCESSFUL':
				showSuccessModal = true;
				return [
					`Swapped ${outTokenQty} ${outToken?.symbol} for ${inTokenQty} ${inToken?.symbol}`,
					true,
					'success'
				];
			default:
				return ['', false, ''];
		}
	}
</script>
