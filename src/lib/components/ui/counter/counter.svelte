<script lang="ts">
	export let target: number;
	export let show = true;
	export let formatter: (value: number) => void = (value: number) => value;
	export let current = 0;
	export let direction = 'up';
	export let step = 10;
	export let duration = 2000;

	$: {
		if (show) {
			if (direction === 'down') {
				triggerEffectDecrease();
			} else {
				triggerEffectIncrease();
			}
		}
	}

	function triggerEffectDecrease() {
		const totalSteps = duration / step;
		const decreasePerStep = target / totalSteps;

		const interval = setInterval(() => {
			current -= decreasePerStep;
			// When we've reached or exceeded our target, clear the interval
			if (current <= target) {
				current = target; // Ensure we don't overshoot the target
				clearInterval(interval);
			}
		}, step);
	}

	function triggerEffectIncrease() {
		const totalSteps = duration / step;
		const increasePerStep = target / totalSteps;

		const interval = setInterval(() => {
			current += increasePerStep;
			// When we've reached or exceeded our target, clear the interval
			if (current >= target) {
				current = target; // Ensure we don't overshoot the target
				clearInterval(interval);
			}
		}, step);
	}
</script>

<p {...$$restProps}>{formatter(current)}</p>
