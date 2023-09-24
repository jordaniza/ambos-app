<script lang="ts">
	import { page } from '$app/stores';
	import { ROUTES } from '$lib/constants';
	import type { Step } from '.';
	import Stepper from './stepper.svelte';

	const steps: Step[] = [
		{
			name: 'Calculate',
			route: ROUTES.LOANS_V2_CALCULATE
		},
		{
			name: 'Transfer ETH',
			route: ROUTES.LOANS_V2_TRANSFER
		},
		{
			name: 'Review Loan',
			route: ROUTES.LOANS_V2_REVIEW
		}
	];
</script>

<Stepper {steps} />
