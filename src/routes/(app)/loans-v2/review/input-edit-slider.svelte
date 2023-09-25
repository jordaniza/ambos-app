<script lang="ts">
	import Range from '$lib/components/range/range.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let title: string;
	export let max: number;
	export let step: number;
	export let value: number;
	export let formatter: (value: number) => string;

	let showRange = false;
	let isFocused = false;

	function setShowRange() {
		showRange = true;
	}

	let tempValue: string = formatter(value);
	let data = {
		raw: 0,
		formatted: ''
	};
	let lastValidValue: string = '';

	function isNumeric(value: string): boolean {
		return /^[0-9]*\.?[0-9]*$/.test(value);
	}

	function onInput(): void {
		if (!isNumeric(tempValue)) {
			tempValue = lastValidValue;
		} else {
			lastValidValue = tempValue;
		}
	}

	function onFocus(): void {
		tempValue = data.raw === 0 ? '' : data.raw.toString();
		lastValidValue = tempValue;
		isFocused = true;
	}

	function onBlur(): void {
		data.raw = parseFloat(tempValue) || 0; // Convert the string value back to a float
		value = data.raw; // Update the depositValue based on input
		data.formatted = formatter(data.raw);
		tempValue = data.formatted;
		isFocused = false;
	}

	$: {
		if (!isFocused) {
			data.raw = value;
			data.formatted = formatter(value);
			tempValue = data.formatted;
		}
	}
</script>

<div>
	<div class="flex w-full justify-between items-center font-extrabold tracking-widest">
		<p class="text-sm font-extrabold">{title}</p>
		{#if !showRange}<Button
				variant="link"
				class="no-underline text-sm font-bold tracking-widest"
				on:click={setShowRange}>Edit</Button
			>
		{/if}
	</div>
	{#if showRange}<div class="py-3">
			<Range bind:value {max} {step} />
		</div>
	{/if}
	<input
		bind:value={tempValue}
		on:focus={onFocus}
		on:blur={onBlur}
		on:input={onInput}
		disabled={!showRange}
		class="
            border-[1px] rounded-xl border-secondary text-center py-2
            bg-popover shadow-md font-bold w-full text-sm"
	/>
</div>
