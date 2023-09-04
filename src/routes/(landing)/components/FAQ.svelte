<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import Container from './Container.svelte';

	const _FAQ = [
		{
			idx: 0,
			Q: 'Why would I borrow against ETH instead of selling it?',
			A: 'If you sell ETH, you get 100% of the value of it *today*. If you borrow with Ambos, you get 50% of that value *now* plus you still get exposure to the upside of ETH increasing in price. If ETH doubles in value, you will be able to close out the loan and sell the ETH for a higher price.'
		},
		{
			idx: 1,
			Q: 'Do I need to pass a credit check to qualify for a loan?',
			A: 'No. Because you must deposit more ETH than the value of the loan, you are already fully covered. We do not need to check your credit score or any other information.'
		},
		{
			idx: 2,
			Q: 'Do I need to own Ether (ETH) to use Ambos?',
			A: "ETH is needed to take out a loan, however we allow purchasing of ETH directly in our application if you don't already have access to some."
		},
		{
			idx: 3,
			Q: 'Can I use ETH I already own with Ambos?',
			A: 'Absolutely. We support sending and receiving ETH and USDC from any other crypto wallet or exchange that allows transfers.'
		},
		{
			idx: 4,
			Q: 'Who is lending me the money?',
			A: 'Ambos connects you to a decentralised network of lenders on a platform called Aave. These lenders have deposited their USDC for people like you to borrow, in exchange for interest.'
		},
		{
			idx: 5,
			Q: 'What currencies do you support?',
			A: 'We convert your ETH into a loan in USDC, a stablecoin pegged to the US Dollar. USDC can then be sold for any supported fiat currencies by our partner, Transak, or sent to an exchange of your choice.'
		},
		{
			idx: 6,
			Q: 'What are the costs of using Ambos Finance?',
			A: 'Borrowed funds accrue an extremely low rate of interest (typically 3%-5% per year). On top of interest Ambos will charge a 1% fee on deposits, and there are additional charges for converting between cash and crypto. In total you should expect to pay no more than a low single digit percent over the lifetime of the loan.'
		},
		{
			idx: 7,
			Q: 'What happens to my deposits if Ambos finance is shutdown?',
			A: "Nothing. Ambos doesn't hold your deposits nor do we have access to them."
		},
		{
			idx: 8,
			Q: 'How do I know my funds are secure?',
			A: "We deposit your funds into a lending protocol known as Aave. Aave is one of the largest and most secure protocols in the entire DeFi (Decentralised Finance) ecosystem and have safely processed billions of dollars in loans since 2017. We can think of no safer protocol to put your money, that's why we chose them."
		},
		{
			idx: 9,
			Q: 'What if I cannot repay the loan?',
			A: 'You will not be able to reclaim your deposited ETH until the loan is repaid. However, neither Ambos nor anyone else will be asking for the money back - you are already fully covered at the time the loan is made.'
		},
		{
			idx: 10,
			Q: 'Do you support depositing other assets like Bitcoin?',
			A: 'Not at this time, although we may consider it in the future.'
		},
		{
			idx: 11,
			Q: 'What if ETH drops in value?',
			A: 'When you take our a loan, we take a snapshot of the value of your ETH. Provided the value of that deposited ETH stays above a certain threshold, then nothing will happen. If ETH falls drastically, you may be *liquidated* to ensure lenders are paid off. See *What are Liquidations?* for more info.'
		},
		{
			idx: 12,
			Q: 'What are Liquidations?',
			A: 'If the value of your ETH becomes too low, relative of the value of your loan + accrued interest, your ETH will be sold to ensure lenders are covered. This is known as a Liquidation. At that point, your loan is cleared: you no longer have to pay the original borrowed amount back, but you also no longer have access to the principal you deposited.'
		},
		{
			idx: 13,
			Q: 'How am I secured without a private key?',
			A: 'When you login with Ambos, behind the scenes a private key is created for you using the Particle Auth network, which automatically shards and secures the key across multiple devices. See https://docs.particle.network/overview/security for more info.'
		},
		{
			idx: 14,
			Q: "Why don't I just use Aave Directly?",
			A: "You are welcome to, but it will be a lot more complex. Our focus is on providing a streamlined experience for a single purpose (borrowing fiat currency with ETH as collateral). We've focused on making that as simple and easy as possible but nothing is stopping you from using Aave or any other platform."
		},

		{
			idx: 15,
			Q: "Why the name 'Ambos Finance'?",
			A: "Ambos is a Spanish word meaning 'both', because Ambos let's you have it both ways - you are able to get cash out of your crypto without selling it, and still have the upside of your crypto investments."
		}
	];

	const FAQ = _FAQ.sort((a, b) => a.idx - b.idx);
</script>

<Container>
	<section class="my-10 flex flex-col items-center w-full justify-center">
		<h1 class="text-3xl md:text-5xl my-10 px-3 text-center">Frequently Asked Questions</h1>
		<Accordion.Root class="w-full items-center text-left">
			{#each FAQ as item}
				<Accordion.Item class="px-3 text-lg text-left" value={item.idx.toString()}>
					<Accordion.Trigger class="font-bold text-left">{item.Q}</Accordion.Trigger>
					<Accordion.Content class="text-lg">{item.A}</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</section>
</Container>
