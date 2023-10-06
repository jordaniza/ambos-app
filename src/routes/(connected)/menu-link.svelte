<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let href: string;
	export let name: string;

	$: currentRoute = $page.url.pathname;
	$: textStyle = currentRoute === href ? ' text-secondary ' : '';
</script>

<button
	on:click={() => goto(href)}
	class={textStyle + 'flex flex-col gap-1 items-center w-1/5 select-none focus:outline-none '}
>
	<slot />
	<p>{name}</p>
</button>

<style>
	* {
		-webkit-tap-highlight-color: transparent;
	}
</style>
