<script>
	import { ShareIcon } from 'lucide-svelte';
</script>

<div class="text-xl text-center flex flex-col items-center gap-4">
	<div
		class="rounded-full bg-black px-10 py-2 text-white flex justify-center gap-2 items-center text-2xl"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="29" height="36" viewBox="0 0 29 36" fill="none">
			<path
				d="M15.0198 10.5481C13.6537 10.5481 11.5287 8.97959 9.30244 9.03019C6.31724 9.13138 3.63562 10.7505 2.16832 13.3815C-0.867471 18.6941 1.35878 26.4354 4.34398 30.7361C5.81128 32.8612 7.53156 35.1886 9.7578 35.0874C11.9841 35.0368 12.7936 33.6707 15.4246 33.6707C18.0556 33.6707 18.8146 35.0874 21.142 35.0368C23.4695 34.9862 24.9874 32.9118 26.4547 30.7867C27.4666 29.2688 28.2761 27.6497 28.8327 25.8788C26.0499 24.7151 24.2284 21.9323 24.1778 18.8965C24.2284 16.2149 25.5945 13.7357 27.922 12.3696C26.4547 10.2951 24.1272 9.03019 21.5974 8.929C18.8146 8.72661 16.3354 10.5481 15.0198 10.5481ZM19.8771 6.09559C21.1926 4.57769 21.8504 2.60443 21.6986 0.580566C19.7253 0.782953 17.9545 1.69369 16.6389 3.21159C15.3234 4.67889 14.6657 6.60155 14.8175 8.52422C16.7401 8.57482 18.6122 7.66408 19.8771 6.09559Z"
				fill="white"
			/>
		</svg>
		<p>for iOS</p>
	</div>
	<p class="text-secondary font-bold">iPhone Installation Guide</p>
	<div class="flex flex-col gap-5 items-center text-lg">
		<p>Make sure this page is open in the Safari web browser</p>
		<p>
			Tap the <span class="font-bold">“Share”</span> icon <ShareIcon class="inline-block" /> in Safari.
		</p>
		<p>Select <span class="font-bold">“Add to Home Screen”</span> from the options.</p>
		<p>Confirm the installation by tapping the <span class="font-bold">“Add”</span> button.</p>
		<p>
			After a few seconds, the app will be installed and you can find and open it from your home
			screen
		</p>
	</div>
</div>
