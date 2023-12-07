<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import { getAccountStore } from '$lib/context/getStores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import LoadingSpinner from '$lib/components/ui/loadingSpinner/loading-spinner.svelte';
	import { API_ROUTES } from '$lib/constants';

	let accountStore = getAccountStore();
	let submittingFeedback = false;
	let feedback = '';

	$: address = $accountStore.address;

	async function handleSubmitFeedback() {
		submittingFeedback = true;
		try {
			if (feedback && address) {
				const response = await fetch(API_ROUTES.POST.FEEDBACK, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ feedback, scw: address })
				});
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				if (response.status === 200) {
					toast.success('Feedback submitted successfully');
					feedback = '';
				}
			}
		} catch (e) {
			console.error(e);
			toast.error('Failed to submit feedback');
		} finally {
			submittingFeedback = false;
		}
	}
</script>

<Card variant="popover" class="flex flex-col gap-3 items-center p-4">
	<p class="text-start text-sm w-full font-bold">Got Feedback? We'd love to hear it.</p>
	<textarea
		bind:value={feedback}
		rows="5"
		class="w-full rounded-xl bg-popover border-muted border-[1px] p-1 text-sm px-3 py-1"
		placeholder="Enter your feedback here..."
	/>
	<Button
		variant="outline"
		on:click={handleSubmitFeedback}
		disabled={!feedback || submittingFeedback}
		class="w-full border-secondary text-secondary"
	>
		{#if submittingFeedback}
			<LoadingSpinner />
		{:else}
			Submit
		{/if}
	</Button>
</Card>
