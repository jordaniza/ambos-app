<script lang="ts">
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants';
	import { Bell } from 'lucide-svelte';

	export let page = 'Dashboard';
	export let subtitle: string = '';
</script>

<nav class="w-full pt-4 px-4 pb-4 tracking-widest text-popover flex flex-col gap-5">
	<div class="flex justify-between">
		<a href={ROUTES.WELCOME}>{page}</a>
		<Bell class="h-5 w-5" on:click={() => goto(ROUTES.NOTIFICATIONS)} />
	</div>
	<p class="">{subtitle}</p>
</nav>
