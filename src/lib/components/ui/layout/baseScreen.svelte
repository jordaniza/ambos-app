<script>
	/**
	 * A common layout for base app screens. We can't apply this easily in +layout.svelte
	 * because we have multiple named slots.
	 */
	import Card from '../card/card.svelte';
</script>

<div class="h-full absolute inset-0 -z-10 bg-primary">
	<slot name="background" />
</div>
<div
	class="
    text-popover p-2 flex flex-col items-center text-center
    justify-start min-h-[140px] tracking-widest"
>
	<slot name="header" />
</div>
<div class="rounded-3xl w-full relative bg-background h-full">
	<slot name="card" />
</div>
