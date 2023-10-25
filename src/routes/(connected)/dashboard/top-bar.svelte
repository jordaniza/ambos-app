<script lang="ts">
	import { goto } from '$app/navigation';
	import NotificationBell from '$lib/components/ui/notification/notificationBell.svelte';
	import { LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';

	export let page = 'Dashboard';
	export let subtitle: string = '';
	function handleWelcome() {
		localStorage.removeItem(LOCAL_STORAGE_KEYS.WELCOME);
		goto(ROUTES.WELCOME);
	}
</script>

<nav class="w-full pt-4 px-4 pb-4 text-popover flex flex-col gap-5">
	<div class="flex justify-between">
		<button on:click={handleWelcome}>{page}</button>
		<slot />
		<NotificationBell />
	</div>
	<p class="">{subtitle}</p>
</nav>
