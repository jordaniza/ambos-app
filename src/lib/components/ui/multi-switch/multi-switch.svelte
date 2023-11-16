<script lang="ts">
	import { tweened } from 'svelte/motion';
	export let items: string[];
	export let selectedIndex = 0;
	export let disabled = false;

	const leftValue = tweened(0, { duration: Math.round(300 / items.length) });

	function select(index: number) {
		selectedIndex = index;
		leftValue.set(selectedIndex * (100 / items.length));
	}
</script>

{#if items}
	<div class="bg-card py-1.5 rounded-2xl relative flex text-sm">
		{#each items as value, index}
			<button
				class={'select-none focus:outline-none text-center flex-1 z-10 ' +
					(selectedIndex === index && !disabled ? 'text-secondary' : '')}
				{disabled}
				on:click={() => select(index)}
			>
				{value}
			</button>
		{/each}
		{#if !disabled}
			<div
				class="select-none absolute top-0 bottom-0 bg-popover shadow-lg rounded-2xl transform transition-transform duration-300"
				style="width: {100 / items.length + '%'}; left: {$leftValue + '%'};"
			/>
		{/if}
	</div>
{/if}

<style>
	* {
		-webkit-tap-highlight-color: transparent;
	}
</style>
