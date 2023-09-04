<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let y: number;
	let navFloat = false;
	$: navFloat = y > 10;

	export let goToCTA: () => void;
</script>

<svelte:window bind:scrollY={y} />
<!--Nav-->
<nav
	id="header"
	class={`
  fixed w-full z-30 top-0 text-white
  ${navFloat && 'bg-white'}
  `}
>
	<div class="px-5 w-full mx-auto flex flex-wrap items-center justify-between mt-0 py-5">
		<div class="flex items-center justify-center sm:justify-between">
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a
				class:text-gray-800={navFloat}
				class:text-white={!navFloat}
				class="no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
				href="#"
			>
				<div class="flex gap-4 items-center">
					<img src="semicircle.png" alt="Ambos Finance Logo" height="50" width="60" class="pb-3" />
					<h1>Ambos Finance</h1>
				</div>
			</a>
		</div>
		<Button class="hidden sm:flex sm:text-xl sm:py-6" on:click={goToCTA} variant="outline"
			>Sign Up</Button
		>
	</div>
</nav>
