<script lang="ts">
	/**
	 * Input that formats a value when it is not focused
	 * inputting a value will override the formatted value
	 */

	import type { HTMLInputAttributes } from 'svelte/elements';

	type $$Props = {
		formatter: (value: number) => string;
		max?: number | undefined;
	} & HTMLInputAttributes;

	export let value: $$Props['value'] = undefined;
	export let formatter: (...args: number[]) => string;
	export let max: number | undefined = undefined;

	let isFocused = false;
	let tempValue: string = formatter(value);
	let data = {
		raw: 0,
		formatted: ''
	};
	let lastValidValue: string = '';
	let el: HTMLInputElement;

	function isNumeric(value: string): boolean {
		return /^[0-9]*\.?[0-9]*$/.test(value);
	}

	// when the user inputs a value, we validate it and revert to the last valid value if it is not valid
	function onInput(): void {
		if (!isNumeric(tempValue)) {
			tempValue = lastValidValue;
		} else {
			lastValidValue = tempValue;
		}
	}

	function handleEnterKey(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			event.preventDefault(); // to prevent any default behavior
			el.blur();
		}
	}

	// when the user clicks on the input, we want to show the raw value
	function onFocus(): void {
		tempValue = data.raw === 0 ? '' : data.raw.toString();
		lastValidValue = tempValue;
		isFocused = true;
	}

	// when the user clicks away from the input, we want to show the formatted value
	function onBlur(): void {
		let parsed = parseFloat(tempValue) || 0;
		if (max && parsed > max) {
			parsed = max;
		}
		data.raw = parsed; // Convert the string value back to a float
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
	bind:this={el}
	bind:value={tempValue}
	on:focus={onFocus}
	on:blur={onBlur}
	on:input={onInput}
	on:keydown={handleEnterKey}
	{...$$restProps}
/>
