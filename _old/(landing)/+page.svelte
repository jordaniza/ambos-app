<script lang="ts">
	import Nav from './components/Nav.svelte';
	import Hero from './components/Hero.svelte';
	import Features from './components/Features.svelte';
	import Cards from './components/SimpleAndFast.svelte';
	import FAQ from './components/FAQ.svelte';
	import CallToAction from './components/CallToAction.svelte';
	import Footer from './components/Footer.svelte';
	import HowItWorks from './components/HowItWorks.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { onMount } from 'svelte';

	// wil be bound to create scroll behavior
	let scroll: Element;
	function goToCTA() {
		scroll?.scrollIntoView({ behavior: 'smooth' });
	}

</script>

<svelte:head>
	<title>Ambos Finance | Get Cash Today, Without Selling Your Crypto</title>

	<!-- Meta tags for SEO -->
	<meta
		name="description"
		content="Ambos finance is an application that lets you easily borrow USD against the value of your ETH holdings and withdraw to a fiat currency of your choice. Unlock the cash value of your ETH without selling. Live your life today, while your investments grow for tomorrow."
	/>
	<meta name="keywords" content="Ambos, Finance, Crypto, USD, ETH, Borrow, Invest, Fiat" />

	<!-- Social media sharing -->
	<meta property="og:title" content="Ambos Finance" />
	<meta property="og:description" content="Unlock the cash value of your ETH without selling." />
	<meta property="og:image" content="ambos.png" />
	<meta property="og:url" content="ambos.finance" />

	<!-- Twitter specific meta tags -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Ambos Finance" />
	<meta name="twitter:description" content="Unlock the cash value of your ETH without selling." />
	<meta name="twitter:image" content="ambos.png" />

	<script
		async
		src="https://analytics.umami.is/script.js"
		data-website-id="e8b6a1b3-ed99-4185-843b-5e6651495eab"
	></script>
</svelte:head>

<div
	class="leading-normal tracking-normal text-white gradient"
	style="font-family: 'Source Sans Pro', sans-serif;"
>
	<Nav {goToCTA} />
	<Hero {goToCTA} />

	<div class="w-full bg-white flex justify-center py-20">
		<section class=" py-8 flex flex-col items-center justify-center max-w-5xl">
			<p class="text-2xl text-gray-800 m-8 max-w-5xl text-center">
				Ambos finance is an application that lets you easily borrow USD against the value of your
				ETH holdings and withdraw to a fiat currency of your choice.
				<br />
				<br />
				Unlock the cash value of your ETH without selling.
				<br />
				<br />
				<span class="font-bold"
					>Live your life today, while your investments grow for tomorrow.</span
				>
			</p>
			<Separator class="w-1/6 my-10" />
		</section>
	</div>

	<HowItWorks />

	<Features />

	<Cards />
	<div bind:this={scroll}>
		<CallToAction />
	</div>
	<FAQ />
	<Footer />
</div>
