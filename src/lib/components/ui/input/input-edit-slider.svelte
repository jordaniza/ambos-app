<script lang="ts">
	import Range from '$lib/components/range/range.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import FormatInput from '$lib/components/ui/input/formatInput.svelte';

	export let title: string;
	export let max: number;
	export let step: number;
	export let value: number;
	export let formatter: (...args: number[]) => string;
	export let formatterArgs: number[] = [value];
	export let showRange = false;
	export let showMax = false;
	export let allowEdit = true;
	export let maxFormatter: (max: number) => string = (max) => max.toString();

	function edit() {
		showRange = true;
	}

	function setMax() {
		value = max;
	}
</script>

<div>
	<div class="flex w-full justify-between items-center font-extrabold">
		<p class="text-sm font-extrabold pb-2">{title}</p>
		<div class="flex items-center justify-end">
			{#if allowEdit && !showRange}<Button
					variant="link"
					class="no-underline text-sm font-bold -mx-2 "
					on:click={edit}>Edit</Button
				>
			{/if}
			<slot name="tooltip" />
		</div>
	</div>
	{#if showRange}<div class="py-3">
			<Range bind:value {max} {step} />
		</div>
	{/if}
	<FormatInput
		{max}
		bind:value
		formatter={() => formatter(...formatterArgs)}
		disabled={!showRange}
		class="  
            border-[1px] rounded-xl border-muted-foreground focus:outline-secondary text-center py-2
            bg-popover shadow-md font-bold w-full text-sm"
	/>
	<div class="flex justify-between items-center py-2 w-full">
		<slot name="below-input-left"><div /></slot>
		{#if showMax && showRange}
			<button on:click={setMax} class="flex gap-1 text-xs">
				<p class="font-bold">Max:</p>
				<p class="underline underline-offset-1.5">{maxFormatter(max)}</p>
			</button>
		{/if}
	</div>
</div>
