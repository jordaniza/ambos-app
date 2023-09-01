<script lang="ts">
	import { ROUTES } from '$lib/constants';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	import WalletIcon from 'svelte-icons/fa/FaWallet.svelte';
	import LoansIcon from 'svelte-icons/fa/FaMoneyBill.svelte';
	import DashboardIcon from 'svelte-icons/fa/FaChartLine.svelte';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav text-xl mt-10 flex flex-col w-full justify-between">
	<section>
		<ul class="flex flex-col w-full">
			<li>
				<a class="flex-auto py-2" href={ROUTES.DASHBOARD} on:click={drawerClose}>
					<span class="w-6 h-6 mx-3"><DashboardIcon /></span>
					Dashboard
				</a>
			</li>
			<li>
				<a class="flex-auto" href={ROUTES.WALLET} on:click={drawerClose}>
					<span class="w-6 h-6 mx-3"><WalletIcon /></span>
					Wallet</a
				>
			</li>
			<li>
				<a class="flex-auto" href={ROUTES.MY_LOANS} on:click={drawerClose}>
					<span class="w-6 h-6 mx-3"><LoansIcon /></span>
					My Loans
				</a>
			</li>
		</ul>
	</section>
</nav>
