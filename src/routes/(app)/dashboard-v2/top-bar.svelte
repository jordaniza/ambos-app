<script lang="ts">
	import NotificationBell from '$lib/components/ui/notification/notificationBell.svelte';
	import { ROUTES } from '$lib/constants';

	export let page = 'Dashboard';
	export let subtitle: string = '';
</script>

<nav class="w-full pt-4 px-4 pb-4 tracking-widest text-popover flex flex-col gap-5">
	<div class="flex justify-between">
		<a href={ROUTES.WELCOME}>{page}</a>
		<NotificationBell />
	</div>
	<p class="">{subtitle}</p>
</nav>
