<script lang="ts">
	import { createClient } from '@supabase/supabase-js';

	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	const SUPABASE_ANON_KEY =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvcGplYnN0bHB3ZG56ZHhmY3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5MzEwODYsImV4cCI6MjAwOTUwNzA4Nn0.ktx4vqVNKooKpYLm5Iwk0guc61FH4KMXitSeXrHB8Rs';
	const SUPABASE_URL = 'https://yopjebstlpwdnzdxfcte.supabase.co';
	const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

	let email = '';
	let isSubmitting = false;
	let emailError = false;
	let submitted = false;
	let dialogOpen = false;

	function isValidEmail(email: string) {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		return re.test(email);
	}

	async function handleSubmit() {
		if (!isValidEmail(email)) return;

		submitted = false;
		emailError = false;
		isSubmitting = true;

		const { error } = await supabase.from('emails').insert([{ email }]);

		isSubmitting = false;

		if (error) {
			console.error('Error inserting email: ', error);
			emailError = true;
			return;
		}

		submitted = true;
		dialogOpen = true; // Open the dialog
		email = ''; // Reset the email field
	}

	// To test inserting data
	async function testInsert() {
		const { data, error } = await supabase.from('emails').insert([{ email: 'j@test.com' }]);

		if (error) {
			console.error('Insert Error:', error);
		} else {
			console.log('Insert Data:', data);
		}
	}
</script>

<Dialog.Root open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Thank You</Dialog.Title>
			<Dialog.Description>Your email has been submitted.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button on:click={() => (dialogOpen = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
<!-- Change the colour #f8fafc to match the previous section colour -->
<div class="relative -mt-[1px]">
	<svg
		class="wave-top"
		viewBox="0 0 1439 147"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
	>
		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<g transform="translate(-1.000000, -14.000000)" fill-rule="nonzero">
				<g class="wave" fill="#ffffff">
					<path
						d="M1440,84 C1383.555,64.3 1342.555,51.3 1317,45 C1259.5,30.824 1206.707,25.526 1169,22 C1129.711,18.326 1044.426,18.475 980,22 C954.25,23.409 922.25,26.742 884,32 C845.122,37.787 818.455,42.121 804,45 C776.833,50.41 728.136,61.77 713,65 C660.023,76.309 621.544,87.729 584,94 C517.525,105.104 484.525,106.438 429,108 C379.49,106.484 342.823,104.484 319,102 C278.571,97.783 231.737,88.736 205,84 C154.629,75.076 86.296,57.743 0,32 L0,0 L1440,0 L1440,84 Z"
					/>
				</g>
				<g transform="translate(1.000000, 15.000000)" fill="#FFFFFF">
					<g
						transform="translate(719.500000, 68.500000) rotate(-180.000000) translate(-719.500000, -68.500000) "
					>
						<path
							d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
							opacity="0.100000001"
						/>
						<path
							d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
							opacity="0.100000001"
						/>
						<path
							d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
							opacity="0.200000003"
						/>
					</g>
				</g>
			</g>
		</g>
	</svg>
</div>
<section class="container mx-auto text-center py-6 mb-12">
	<h1 class="w-full my-2 text-5xl font-bold leading-tight text-center text-white">Sign Up</h1>
	<div class="w-full my-10">
		<div class="h-[1px] mx-auto bg-white w-1/6 opacity-25 my-0 py-0 rounded-t" />
	</div>
	<h3 class="my-10 text-xl md:text-2xl leading-tight">
		Ambos is currenly in final testing and we will be rolling out to early access users soon.
		<br />
		<br />
		To join our early access programme or get notified about our full launch, please enter your email
		address below:
	</h3>

	<div class="flex items-center flex-col justify-center my-10 gap-3">
		<Input
			bind:value={email}
			placeholder="Email Address"
			class="max-w-md text-xl md:text-2xl py-7 mb-5"
		/>
		<Button
			class="text-white text-xl md:text-2xl py-7"
			disabled={!isValidEmail(email) || isSubmitting}
			on:click={handleSubmit}
		>
			{isSubmitting ? 'Submitting...' : 'Join Waitlist'}
		</Button>
	</div>

	{#if submitted}
		<p class="text-green-500">Submitted, thank you</p>
	{:else if emailError}
		<p class="text-red-500">Error submitting email</p>
	{/if}
</section>
