<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex justify-center w-full">
	<div class="p-4 flex flex-col gap-2 w-full max-w-[1000px] pt-10">
		<p class="text-xl">DISCLAMER</p>

		<p>
			This calculator is for illustrative purposes only. It is not intended to be a substitute for
			professional financial advice. While every attempt has been made to ensure that the
			calculations presented here are representative, Ambos Finance does not guarantee the accuracy
			of the calculations or their applicability to your circumstances. <br />As always, do your own
			research: taking out a loan in any circumstance involves risk, and, especially in DeFi, it's
			important to understand these risks.
		</p>

		<Button variant="link" class="text-base" on:click={() => goto('/')}>Back</Button>
	</div>
</div>
