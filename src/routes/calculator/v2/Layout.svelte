<script lang="ts">
	import Stepper from '$lib/components/ui/stepper/stepper.svelte';
	import { ROUTES } from '$lib/constants';

	const steps = [
		{
			route: ROUTES.CALCULATOR_V2_START,
			name: 'ETH Deposit'
		},
		{
			route: ROUTES.CALCULATOR_V2_BORROW,
			name: 'USD Borrow'
		},
		{
			route: ROUTES.CALCULATOR_V2_SIMULATE,
			name: 'Simulate Results'
		}
	];
</script>

<div class="flex flex-wrap items-center w-full justify-center text-base">
	<div class=" grow w-full flex items-center justify-center">
		<img src="/ambos-header.png" alt="ambos logo" class="h-16 my-5" />
	</div>
	<div class="max-w-4xl grow">
		<slot name="banner" />
		<div class="pt-2 pb-5">
			<Stepper {steps} />
		</div>
		<slot />
	</div>
</div>
