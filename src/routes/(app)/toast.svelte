<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	const isDarkMode = true;
	const style = 'background: hsl(222.2, 84%, 4.9%); color: var(--card-foreground); z-index: 9999; opacity: 1;';
</script>

<div class={isDarkMode ? 'dark' : 'base'}>
	<Toaster
    richColors
		toastOptions={{
			style
		}}
	/>
</div>
