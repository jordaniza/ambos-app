<script lang="ts">
	import '../../app.postcss';
	import Nav from './components/Nav.svelte';
	import Hero from './components/Hero.svelte';
	import Features from './components/Features.svelte';
	import Cards from './components/Cards.svelte';
	import Pricing from './components/Pricing.svelte';
	import CallToAction from './components/CallToAction.svelte';
	import Footer from './components/Footer.svelte';
	import HowItWorks from './components/HowItWorks.svelte';
</script>

<div
	class="leading-normal tracking-normal text-white gradient"
	style="font-family: 'Source Sans Pro', sans-serif;"
>
	<Nav />

	<Hero />
	<section class="bg-white py-8">
		<p class="text-xl text-gray-800 m-8">
			Ambos finance is an application that lets you easily borrow USD against the value of your ETH
			holdings and withdraw to a fiat currency of your choice.
			<br />
			<br />
			Unlock the cash value of your ETH without selling.
			<br />
			<br />
			<span class="font-bold">Live your life today, while your investments grow for tomorrow.</span>
		</p>
	</section>

	<HowItWorks />

	<Features />

	<Cards />

	<Pricing />

	<CallToAction />

	<Footer />
</div>
