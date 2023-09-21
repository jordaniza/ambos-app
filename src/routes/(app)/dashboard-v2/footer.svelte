<script lang="ts">
	import {
		Home as Dashboard,
		Banknote as Loans,
		Wallet as Wallet,
		Calculator as Calculator,
		User as User
	} from 'lucide-svelte';

	const iconHeight = 5;
</script>

<footer
	class="fixed bottom-0 left-0 w-full flex justify-between items-center py-3 px-4 bg-popover z-10 text-xs"
>
	<!-- Dashboard Icon -->
	<div class="flex flex-col gap-1 items-center w-1/5">
		<Dashboard class={'text-secondary h-' + iconHeight} />
		<p class="text-secondary">Dashboard</p>
	</div>

	<!-- Loans Icon -->
	<div class="flex flex-col gap-1 items-center w-1/5">
		<Loans class={'h-' + iconHeight} />
		<p>Loans</p>
	</div>

	<!-- Wallet Icon (Raised) -->
	<div class="relative -mb-6 w-1/5">
		<div class="semicircle absolute -z-1 bg-popover" />
		<div
			class="
        p-3
        absolute
        -top-7
        left-2/4
        transform
        -translate-x-2/4
        -translate-y-2/4
        w-12 h-12
        rounded-full
        flex j
        ustify-center
        items-center
        bg-primary"
		>
			<Wallet class={'text-popover h-' + iconHeight} />
		</div>
		<div class="text-center">Wallet</div>
	</div>

	<!-- Calculator Icon -->
	<div class="flex flex-col gap-1 items-center w-1/5">
		<Calculator class={'h-' + iconHeight} />
		<p>Calculator</p>
	</div>

	<!-- Profile Icon -->
	<div class="flex flex-col gap-1 items-center w-1/5">
		<User class={'h-' + iconHeight} />
		<p>Profile</p>
	</div>
</footer>

<style>
	.semicircle {
		border-radius: 50% 50% 0% 0%;
		width: 70px;
		height: 60px;
		bottom: 115%;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
