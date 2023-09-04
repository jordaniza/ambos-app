<script lang="ts">

	// setup the login button
	import { accountStore } from '$stores/account';
	import { web3Store } from '$stores/web3';

	$: tableArr = Object.entries($web3Store.balances).map(([id, balance]) => {
		return {
			name: id,
			balance: balance.small,
			lastUpdated: balance.lastUpdatedBlock
		};
	});

</script>
<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Asset</th>
				<th>Balance</th>
				<th>Last Updated</th>
			</tr>
		</thead>
		<tbody>
			{#if !$accountStore.address}
				<tr>
					<td colspan="3">Loading...</td>
				</tr>
			{:else}
				{#each tableArr as row}
					<tr>
						<td>{row.name}</td>
						<td>{row.balance}</td>
						<td>{row.lastUpdated}</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
