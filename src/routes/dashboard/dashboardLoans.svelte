<script>
	import { ROUTES } from '$lib/constants';

	let owed = 0;
	let collateralValueUSD = 0;
	let variableRateIR = 0;
</script>

<div class="card p-4 m-2">
	<div>
  <h1 class="my-5">Loans Overview</h1>
		<p>A summary of your current outstanding loan balances.</p>
	</div>
	<section class="grid grid-cols-2 gap-0">
		<div class="grid grid-cols-1 gap-4">
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">Owed</p>
				<p class="text-xl font-bold">{owed}</p>
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">Supplied</p>
				<p class="text-xl font-bold">{collateralValueUSD}</p>
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-medium leading-none">Interest Rate</p>
				<p class="text-xl font-bold">{variableRateIR}%</p>
			</div>
		</div>
	</section>
	<hr class="my-5" />
	<div>
		<button class="btn variant-filled-primary w-full">
			<a class="w-full" href={ROUTES.MY_LOANS}>Manage Loans</a>
		</button>
	</div>
</div>
