<script lang="ts">
	import { EXCHANGE_GUIDE } from '$lib/constants';

	let items = Array.from({ length: 2 }, (_, i) => {
		if (i % 2 === 0)
			return {
				img: 'binance.png',
				name: 'Binance'
			};
		else
			return {
				img: 'coinbase.png',
				name: 'Coinbase'
			};
	});

	let showAll = false;
	const maxRowsBeforeToggle = 2;
	let displayCount = showAll ? items.length : maxRowsBeforeToggle * 3; // 3 columns

	function handleClick() {
		alert(
			'Exchange guides will made available soon. In the meantime, please use a manual transfer from an exchange of your choice'
		);
	}

	$: displayCount = showAll ? items.length : maxRowsBeforeToggle * 3;
</script>

<div class="grid grid-cols-3 md:grid-cols-5 gap-4">
	{#each items.slice(0, displayCount) as item}
		<button class="w-full flex flex-col gap-1 items-center justify-center" on:click={handleClick}>
			<img class="h-12 w-12" src={'/external/' + item.img} alt={item.name} />
			<p>{item.name}</p>
		</button>
	{/each}
	{#if !showAll && items.length > maxRowsBeforeToggle * 3}
		<button
			class="col-span-3 md:col-span-5 p-2 text-muted-foreground"
			on:click={() => (showAll = true)}
		>
			Show {items.length - maxRowsBeforeToggle * 3} more available exchanges
		</button>
	{/if}
</div>
