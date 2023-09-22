<script lang="ts">
	let page = 'Dashboard';
	import { ROUTES } from '$lib/constants';
	import { Bell } from 'lucide-svelte';
</script>

<nav class="flex justify-between w-full p-4">
	<a href={ROUTES.WELCOME}>{page}</a>
	<Bell class="h-5 w-5 text-foreground" />
</nav>
