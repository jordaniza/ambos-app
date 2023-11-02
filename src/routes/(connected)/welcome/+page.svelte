<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { LOCAL_STORAGE_KEYS, ROUTES } from '$lib/constants';
	import { slide } from 'svelte/transition';
	import { welcomeSteps } from './steps';
	import { browser } from '$app/environment';
	import Carousel from '$lib/components/carousel/main';
	import { goto } from '$app/navigation';
	let currentPageIndex = 0;

	function goToDashboard() {
		localStorage.removeItem(LOCAL_STORAGE_KEYS.WELCOME_DIALOG);
		localStorage.setItem(LOCAL_STORAGE_KEYS.WELCOME, 'true');
		goto(ROUTES.DASHBOARD_V2);
	}
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
		<button class="text-primary" on:click={goToDashboard}>Skip →</button>
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
				<!-- Custom Dot Config -->
				<div slot="dots" class="custom-dots flex gap-1 absolute bottom-3">
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

				<!-- Carousel Slides -->
				{#each welcomeSteps as step}
					<div class="flex flex-col justify-center items-center px-10">
						<!-- image -->
						<div class=" flex flex-col pb-10 justify-end items-center">
							{#if step.img}
								<img class="h-72 w-72 shadow-svg" src={step.img} alt={step.heading} />
							{:else}
								<div class="h-72 w-72 rounded-full bg-primary opacity-40" />
							{/if}
						</div>

						<!-- content -->
						<div class="flex pt-5 flex-col justify-between">
							<div class="text-center px-2">
								<h2 class="font-extrabold text-2xl py-5">{step.heading}</h2>
								<p>{step.text}</p>
							</div>
						</div>
					</div>
				{/each}
			</Carousel>
			<div
				class={currentPageIndex === welcomeSteps.length - 1
					? `w-full max-w-lg mx-auto opacity-100 px-10 -my-10 transition-opacity duration-300 delay-300`
					: `w-full max-w-lg mx-auto opacity-0   px-10 -my-10 transition-opacity duration-300 delay-0`}
			>
				<Button class="w-full" on:click={goToDashboard}>Get Started</Button>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(.sc-carousel__carousel-container) {
		height: 90%;
	}

	:global(.sc-carousel__content-container) {
		height: 90%;
	}
	.shadow-svg {
		filter: url(#svg-shadow);
	}
</style>
