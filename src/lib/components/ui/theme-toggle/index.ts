export { default as ThemeToggle } from './theme-toggle.svelte';
export function loadTheme() {
	// Apply stored preference on page load
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
}
