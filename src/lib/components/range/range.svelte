<script lang="ts">
	export let value = 50;
	export let max = 100;
	export let min = 0;
	export let step = 1;

	const minMaxZeroHundred = (x: number) => Math.max(Math.min(x, 100), 0);

	$: thumbPercentage = minMaxZeroHundred(((value - min) / (max - min)) * 100);
	$: {
		if (value > max) value = max;
	}
</script>

<div class="slider-container">
	<input
		type="range"
		bind:value
		{step}
		{min}
		{max}
		class="slider"
		style="background: linear-gradient(90deg, hsl(219, 97%, 61%) {thumbPercentage}%, hsl(219, 97%, 80%) {thumbPercentage}%);"
	/>
</div>

<style>
	.slider {
		appearance: none;
		width: 100%;
		height: 8px;
		border-radius: 5px;
		outline: none;
		opacity: 0.7;
		padding-top: 4px;
		transition: opacity 0.2s;
	}

	.slider:hover {
		opacity: 1;
	}

	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: white;
		border: 1px solid hsl(0, 0%, 80%);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		margin-top: -6px;
	}

	.slider::-moz-range-thumb {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: white;
		border: 1px solid hsl(0, 0%, 80%);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
	}
</style>
