<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	const isDarkMode = false;
</script>

<div class={isDarkMode ? 'dark' : 'base'}>
	<Toaster richColors />
</div>
