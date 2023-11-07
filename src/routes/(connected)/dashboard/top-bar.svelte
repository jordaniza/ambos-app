<script lang="ts">
	import NotificationBell from '$lib/components/ui/notification/notificationBell.svelte';
	export let page = 'Dashboard';
	export let subtitle: string = '';
</script>

<nav class="w-full pt-4 px-4 pb-4 text-popover flex flex-col gap-5">
	<div class="flex justify-between">
		<p>{page}</p>
		<slot />
		<NotificationBell />
	</div>
	<p class="px-4">{subtitle}</p>
</nav>
