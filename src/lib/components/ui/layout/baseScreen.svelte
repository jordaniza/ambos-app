<script>
	/**
	 * A common layout for base app screens. We can't apply this easily in +layout.svelte
	 * because we have multiple named slots.
	 */
</script>

<div class="h-1/2 absolute top-0 left-0 w-full -z-10">
	<slot name="background" />
</div>
<div
	class="
    text-popover p-2 flex flex-col items-center text-center
    justify-start min-h-[140px]"
>
	<slot name="header" />
</div>
<div class="rounded-3xl w-full absolute top-1/6 bg-background h-full">
	<slot name="card" />
</div>
