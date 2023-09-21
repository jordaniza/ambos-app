<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ROUTES } from '$lib/constants';
	import { slide } from 'svelte/transition';
	import { welcomeSteps } from './steps';
	import { browser } from '$app/environment';
	import Carousel from 'svelte-carousel';
	let currentPageIndex = 0;
</script>

<div class="h-full flex-col relative">
	<!-- title bar -->
	<div class="flex justify-between p-4">
		<h1>{welcomeSteps[0].title}</h1>
		<a class="text-primary" href={ROUTES.DASHBOARD_V2}>Skip →</a>
	</div>

	<div class="h-[90%] w-full pb-5">
		<!-- carousel -->
		{#if browser}
			<Carousel
				infinite={false}
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
					<div class="flex flex-col justify-center items-center">
						<!-- image -->
						<div class=" flex flex-col pb-10 justify-end items-center">
							<div class="h-72 w-72 rounded-full bg-primary opacity-40" />
						</div>

						<!-- content -->
						<div class="flex pt-5 flex-col justify-between">
							<div class="text-center tracking-widest px-2">
								<h2 class="font-extrabold text-2xl">{step.heading}</h2>
								<p>{step.text}</p>
							</div>
						</div>
					</div>
				{/each}
			</Carousel>
			<div
				class={currentPageIndex === welcomeSteps.length - 1
					? `w-full max-w-lg mx-auto opacity-100 px-10 -my-10 transition-opacity duration-300 delay-300`
					: `opacity-0 w-full mx-auto px-10 transition-opacity -my-10 duration-300 delay-0`}
			>
				<Button class="w-full ">
					<a class="w-full" href={ROUTES.DASHBOARD_V2}>Get Started</a>
				</Button>
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
</style>
