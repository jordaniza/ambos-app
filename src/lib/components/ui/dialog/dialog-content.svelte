<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import * as Dialog from '.';
	import { cn, flyAndScale } from '$lib/utils';

	type $$Props = DialogPrimitive.ContentProps & {
		showCloseIcon?: boolean;
		overlayClass?: string;
	};

	let className: $$Props['class'] = undefined;
	export let overlayClass: $$Props['overlayClass'] = undefined;
	export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 200
	};
	export { className as class };
	export let showCloseIcon: boolean = true;
</script>

<Dialog.Portal>
	<Dialog.Overlay class={overlayClass} />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={cn(
			'fixed left-[50%] top-[50%] z-50 grid rounded-2xl w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg md:w-full',
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
