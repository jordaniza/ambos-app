<script lang="ts">
	let page = 'Dashboard';
	import { Bell } from 'lucide-svelte';
</script>

<nav class="flex justify-between w-full p-4">
	<p>{page}</p>
	<Bell class="h-5 w-5 text-foreground" />
</nav>
