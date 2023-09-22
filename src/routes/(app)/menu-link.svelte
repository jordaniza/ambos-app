<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	export let name: string;

	$: currentRoute = $page.url.pathname;
	$: console.log(currentRoute);

	$: textStyle = currentRoute === href ? ' text-secondary ' : '';
</script>

<div class={textStyle + 'flex flex-col gap-1 items-center w-1/5'}>
	<slot />
	<a {href}>{name}</a>
</div>
