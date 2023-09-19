<script lang="ts">
	import Button from '../button/button.svelte';

	function toggleTheme() {
		if (!document) {
			console.error('trying to toggle theme but document is not defined');
			return;
		}
		const root = document.documentElement;
		if (root.classList.contains('dark')) {
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		} else {
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		}
	}
</script>

<Button size="icon" on:click={toggleTheme}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
	</svg>
</Button>
