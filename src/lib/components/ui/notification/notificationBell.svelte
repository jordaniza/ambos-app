<script>
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants';
	import { Bell } from 'lucide-svelte';
	import NotificationCircle from './notificationCircle.svelte';
</script>

<button class="relative" on:click={() => goto(ROUTES.NOTIFICATIONS)}>
	<NotificationCircle position="-right-1 -top-1" />
	<Bell class="h-5 w-5" />
</button>
