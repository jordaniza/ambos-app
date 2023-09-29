<script>
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants';
	import { Bell } from 'lucide-svelte';
</script>

<button on:click={() => goto(ROUTES.NOTIFICATIONS)}>
	<Bell class="h-5 w-5" />
</button>
