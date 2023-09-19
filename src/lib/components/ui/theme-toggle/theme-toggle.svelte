<script lang="ts">
	import { Moon, Sun } from 'lucide-svelte';
	import Button from '../button/button.svelte';
	import { onMount } from 'svelte';

	let theme: 'light' | 'dark' | null = null;

	/**
	 * The theme is set in the root app.html with theme colors defined in app.postcss
	 * Load the theme from local storage in the root +layout.svelte file, then you can change the theme using this button
	 */
	function toggleTheme() {
		if (!document) {
			console.error('trying to toggle theme but document is not defined');
			return;
		}
		const root = document.documentElement;
		if (root.classList.contains('dark')) {
			theme = 'light';
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		} else {
			theme = 'dark';
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		}
	}

	onMount(() => {
		const fetchedTheme = localStorage.getItem('theme');
		if (['dark', 'light', null].includes(fetchedTheme)) {
			theme = fetchedTheme as 'dark' | 'light' | null;
		} else {
			console.warn(`uncrecognized theme ${fetchedTheme}, setting to light`);
			theme = 'light';
		}
	});
</script>

<Button size="icon" on:click={toggleTheme}>
	{#if theme === 'dark'}
		<Sun />
	{:else}
		<Moon />
	{/if}
</Button>
