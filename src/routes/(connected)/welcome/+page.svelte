<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { LOCAL_STORAGE_KEYS, ROUTES, DISCOVER_AMBOS } from '$lib/constants';
	import { slide } from 'svelte/transition';
	import { welcomeSteps } from './steps';
	import { browser } from '$app/environment';
	import Carousel from '$lib/components/carousel/main';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	let currentPageIndex = 0;

	function goToDashboard() {
		localStorage.setItem(LOCAL_STORAGE_KEYS.WELCOME, 'true');
		goto(ROUTES.DASHBOARD_V2);
	}

	let buttonTop = 0;
	$: {
		if (browser) window.addEventListener('resize', updateButtonPosition);
	}

	onMount(() => {
		updateButtonPosition();
	});

	// This function recalculates and updates the button's position
	function updateButtonPosition() {
		const textElement = document.querySelector('.carousel-text') as HTMLElement;
		const dotsElement = document.querySelector('.custom-dots') as HTMLElement;

		const textBottom = textElement?.offsetTop + textElement?.offsetHeight;
		const dotsTop = dotsElement?.offsetTop;

		buttonTop = textBottom && dotsTop ? (textBottom + dotsTop) / 2 + 25 : 0;
	}

	// Cleanup: remove the listener to avoid memory leaks
	onDestroy(() => {
		if (browser) window.removeEventListener('resize', updateButtonPosition);
	});
</script>

<!-- Shadow effect behind the images, ngl just asked GPT to do this -->
<svg width="0" height="0" class="absolute">
	<filter id="svg-shadow" x="-50%" y="-50%" width="200%" height="200%">
		<feGaussianBlur in="SourceAlpha" stdDeviation="50" />
		<feOffset dx="0" dy="0" result="offsetblur" />
		<feFlood flood-color="green" flood-opacity="1" result="color" />
		<feComposite in2="offsetblur" operator="in" result="shadow" />
		<feComposite in2="shadow" operator="over" in="SourceGraphic" />
	</filter>
</svg>

<div class="h-full flex-col relative">
	<!-- title bar -->
	<div class="flex justify-between p-4 absolute top-0 w-full z-10">
		<h1>{welcomeSteps[currentPageIndex ?? 0].title}</h1>
		<button class="text-primary" on:click={goToDashboard}>Go To App →</button>
	</div>

	<div class="h-full w-full pb-5 flex flex-col justify-center items-center">
		<!-- carousel -->
		{#if browser}
			<Carousel
				infinite={false}
				timingFunction="cubic-bezier"
				duration={300}
				arrows={false}
				let:currentPageIndex
				on:pageChange={(e) => {
					currentPageIndex = e.detail;
				}}
			>
				<!-- Carousel Slides -->
				{#each welcomeSteps as step}
					<div class="flex flex-col justify-center items-center px-10">
						<!-- image -->
						<div class=" flex flex-col pb-10 justify-end items-center">
							{#if step.img}
								<img
									class="h-60 w-60 sm:h-72 sm:w-72 shadow-svg"
									src={step.img}
									alt={step.heading}
								/>
							{:else}
								<div class="h-72 w-72 rounded-full bg-primary opacity-40" />
							{/if}
						</div>

						<!-- content -->
						<div class="flex pt-5 flex-col justify-between">
							<div class="text-center px-2">
								<h2 class="carousel-text font-extrabold text-2xl py-5">{step.heading}</h2>
								<p>{step.text}</p>
							</div>
						</div>
					</div>
				{/each}

				<!-- Custom Dot Config -->
				<div slot="dots" class="custom-dots flex gap-1 absolute bottom-6">
					{#each welcomeSteps as _, pageIndex (pageIndex)}
						{#if pageIndex === currentPageIndex}
							<div in:slide={{ axis: 'x', duration: 0 }} class="h-2 w-6 rounded-full bg-primary" />
						{:else}
							<div
								in:slide={{ axis: 'x', duration: 300 }}
								class="h-2 w-2 rounded-full bg-secondary"
							/>
						{/if}
					{/each}
				</div>
			</Carousel>

			<!-- Action buttons - out of carousel for smooth transitions -->
			<div
				style={`top: ${buttonTop}px`}
				class={currentPageIndex === welcomeSteps.length - 1
					? `absolute flex justify-center w-full max-w-lg opacity-100 px-10 transition-opacity duration-300 delay-300`
					: `absolute flex justify-center w-full max-w-lg opacity-0 px-10 transition-opacity duration-300 delay-0`}
			>
				<Button class="px-20">
					<a class="w-full whitespace-nowrap" href={DISCOVER_AMBOS} target="_blank">
						Start Learning</a
					></Button
				>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(.sc-carousel__carousel-container) {
		height: 100%;
	}

	:global(.sc-carousel__content-container) {
		height: 100%;
	}
	.shadow-svg {
		filter: url(#svg-shadow);
	}
</style>
