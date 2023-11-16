<script lang="ts">
	import Button from '../button/button.svelte';
	import { goto } from '$app/navigation';

	export let backTo: string | undefined = undefined;

	function goBack() {
		if (backTo) goto(backTo);
		else window.history.back();
	}
</script>

<Button
	variant="link"
	class="text-popover no-underline flex items-center gap-1  text-md"
	on:click={goBack}
>
	<span>←</span> Back</Button
>
