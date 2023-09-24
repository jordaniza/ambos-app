<script>
	import { MoveLeft } from 'lucide-svelte';
	import Button from '../button/button.svelte';
	import { browser } from '$app/environment';

	function goBack() {
		if (browser) window.history.back();
	}
</script>

<Button
	variant="link"
	class="text-popover no-underline flex items-center gap-1 tracking-widest text-md"
	on:click={goBack}
>
	<span>←</span> Back</Button
>
