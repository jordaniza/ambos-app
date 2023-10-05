<script lang="ts">
	let items = Array.from({ length: 12 }, (_, i) => {
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

	$: displayCount = showAll ? items.length : maxRowsBeforeToggle * 3;
</script>

<div class="grid grid-cols-3 md:grid-cols-5 gap-4">
	{#each items.slice(0, displayCount) as item}
		<div class="p-2 flex flex-col gap-1 items-center justify-center">
			<img class="h-12 w-12" src={'/external/' + item.img} alt={item.name} />
			<p>{item.name}</p>
		</div>
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
