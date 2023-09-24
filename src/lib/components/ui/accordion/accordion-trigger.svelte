<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { ChevronDown, ChevronRight } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	type $$Props = AccordionPrimitive.TriggerProps;
	type $$Events = AccordionPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export let level: AccordionPrimitive.HeaderProps['level'] = 3;
	export { className as class };
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		class={cn(
			'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>span>svg]:rotate-90',
			className
		)}
		{...$$restProps}
		on:click
	>
		<slot />
		<span class={cn('flex items-center gap-2')}>
			<slot name="trigger-right" />
			<ChevronRight
				class="h-5 w-5 transition-transform duration-200 bg-secondary p-[2.5px] text-white rounded-full"
			/>
		</span>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
