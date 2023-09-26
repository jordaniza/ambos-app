<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { cardVariants } from '.';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		variant?: 'default' | 'popover';
		padding?: 'default' | 'base';
	};

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let padding: $$Props['padding'] = 'default';
	export { className as class };
</script>

<div class={cn(cardVariants({ variant, padding, className }))} {...$$restProps}>
	<slot />
</div>
