<script lang="ts">
	export let value = '0x....';
	export let inputValid = false;

	let lastValidValue: string = '';

	function isEthereumAddress(address: string): boolean {
		return /^(0x)?[0-9a-fA-F]{40}$/i.test(address);
	}

	function isValidHexString(str: string): boolean {
		return /^(0x)?[0-9a-fA-F]*$/i.test(str);
	}

	// reactivity is more user-friendly than an on:input handler
	// because it prevents the user from typing invalid characters
	$: {
		if (!isValidHexString(value)) {
			value = lastValidValue;
		} else {
			lastValidValue = value;
		}
	}

	$: {
		inputValid = isEthereumAddress(value);
	}

	// if empty, reset to default
	function onBlur(): void {
		if (!value) {
			value = '0x....';
		}
	}

	// clear the input if the user clicks on it
	function onFocus(): void {
		if (value === '0x....') {
			value = '';
		}
	}
</script>

<input on:focus={onFocus} on:blur={onBlur} type="text" bind:value {...$$restProps} />
