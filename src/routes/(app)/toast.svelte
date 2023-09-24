<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	const isDarkMode = false;

	const style =
		'background: white; color: var(--card-popover-foreground); z-index: 9999; opacity: 1; ';
</script>

<div class={isDarkMode ? 'dark' : 'base'}>
	<Toaster richColors />
</div>
