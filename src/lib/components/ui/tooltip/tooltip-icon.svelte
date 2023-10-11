<script lang="ts">
	import type { Tooltip as TooltipPrimitive } from 'bits-ui';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { cn } from '$lib/utils';
	import { InfoIcon } from 'lucide-svelte';
	import Button from '../button/button.svelte';

	type $$Props = TooltipPrimitive.ContentProps & {
		text: string;
	};

	let className: $$Props['class'] = undefined;

	let open = false;

	function onClick() {
		open = !open;
	}

	export let text: string;
	export { className as class };
</script>

<Tooltip.Root bind:open>
	<Tooltip.Trigger>
		<button on:click={onClick} class="flex items-center justify-center">
			<InfoIcon class={cn('h-4 w-4 text-muted-foreground', className)} />
		</button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>{text}</p>
	</Tooltip.Content>
</Tooltip.Root>
