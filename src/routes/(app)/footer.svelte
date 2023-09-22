<script lang="ts">
	import { ROUTES } from '$lib/constants';
	import {
		Home as Dashboard,
		Banknote as Loans,
		Wallet as Wallet,
		Calculator as Calculator,
		User as User
	} from 'lucide-svelte';
	import MenuLink from './menu-link.svelte';

	const iconHeight = 5;
	const iconHeightClass = 'h-' + iconHeight;
</script>

<footer
	class="fixed bottom-0 left-0 w-full flex justify-between items-center py-3 px-4 bg-popover z-10 text-xs"
>
	<!-- Dashboard Icon -->
	<MenuLink href={ROUTES.DASHBOARD_V2} name="Dashboard">
		<Dashboard class={iconHeightClass} />
	</MenuLink>
	<!-- Loans Icon -->
	<MenuLink href={ROUTES.MY_LOANS} name="Loans">
		<Loans class={iconHeightClass} />
	</MenuLink>

	<!-- Wallet Icon (Raised) -->
	<div class="relative -mb-6 w-1/5">
		<div class="semicircle absolute -z-1 bg-popover" />
		<button
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
			><a href={ROUTES.WALLET} class="w-full h-full">
				<Wallet class={'text-popover ' + iconHeightClass} />
			</a>
		</button>
		<div class="text-center">Wallet</div>
	</div>

	<!-- Calculator Icon -->
	<MenuLink href={ROUTES.CALCULATOR} name="Calculator">
		<Calculator class={iconHeightClass} />
	</MenuLink>

	<!-- Profile Icon -->
	<MenuLink href={ROUTES.PROFILE} name="Profile">
		<User class={iconHeightClass} />
	</MenuLink>
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
