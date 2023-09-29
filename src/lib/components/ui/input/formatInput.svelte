<script lang="ts">
	/**
	 * Input that formats a value when it is not focused
	 * inputting a value will override the formatted value
	 */

	import type { HTMLInputAttributes } from 'svelte/elements';

	type $$Props = {
		formatter: (value: number) => string;
	} & HTMLInputAttributes;

	export let value: $$Props['value'] = undefined;
	export let formatter: (value: number) => string;

	let isFocused = false;
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

<input
	bind:value={tempValue}
	on:focus={onFocus}
	on:blur={onBlur}
	on:input={onInput}
	{...$$restProps}
/>
