<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import * as Dialog from '..';
	import { cn } from '$lib/utils';
	import { fly } from 'svelte/transition';

	type $$Props = DialogPrimitive.ContentProps & {
		showCloseIcon?: boolean;
	};

	let className: $$Props['class'] = undefined;
	// export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 200
	};
	export { className as class };
	export let showCloseIcon: boolean = false;
</script>

<Dialog.Portal>
	<Dialog.Overlay class="bg-black/80" />
	<DialogPrimitive.Content
		transition={(el) => fly(el, { y: 1000, duration: 500, opacity: 0.2 })}
		{transitionConfig}
		class={cn(
			'fixed left-[50%] bottom-0 z-50 grid rounded-2xl w-full max-w-lg translate-x-[-50%] gap-4 border bg-background p-6 shadow-lg md:w-full',
			className
		)}
		{...$$restProps}
	>
		<slot />
		{#if showCloseIcon}
			<DialogPrimitive.Close
				class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
			>
				<span class="sr-only">Close</span>
			</DialogPrimitive.Close>
		{/if}
	</DialogPrimitive.Content>
</Dialog.Portal>
