<script lang="ts">
	import { APP_NAME, ROUTES } from '$lib/constants';

	import {
		Ghost as LoansIcon,
		Menu as HamburgerMenuIcon,
		User as ProfileIcon,
		Wallet2 as WalletIcon,
		BarChartHorizontalBig as DashboardIcon
	} from 'lucide-svelte';

	import { SheetClose, SheetTrigger, Sheet } from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import SheetContent from '$lib/components/ui/sheet/sheet-content.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import AvatarPopover from './profile/avatarPopover.svelte';
	import { page } from '$app/stores';
	import { initAccountStore, disconnect } from '$stores/account';

	import { getAccountStore, getWeb3Store } from '$lib/context/getStores';
	import ThemeToggle from '$lib/components/ui/theme-toggle/theme-toggle.svelte';

	let accountStore = getAccountStore();
	let web3Store = getWeb3Store();

	$: chainId = $web3Store.chainId;
	$: address = $accountStore?.address;
	$: selected = $page.url.pathname;

	async function login() {
		try {
			if (!chainId) throw new Error('No chainId');
			await initAccountStore(chainId);
		} catch (error) {
			console.log('Attempted Login Error: ', error);
		}
	}

	async function logout(): Promise<void> {
		if (!chainId) throw new Error('No chainId');
		await disconnect(chainId);
		// reload the page
		window.location.reload();
	}
</script>

<div class="flex items-center justify-between p-4 backdrop-blur">
	<div class="flex items-center">
		<Sheet>
			<SheetTrigger asChild let:builder>
				<Button builders={[builder]} variant="ghost">
					<HamburgerMenuIcon class="h-6 w-6 my-10" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" class="flex flex-col justify-between">
				<ul class="flex flex-col my-5">
					<SheetClose asChild let:builder>
						<li class="my-3 flex">
							<Button
								variant="ghost"
								class="flex items-center w-full text-xl justify-start"
								builders={[builder]}
							>
								<div class="h-8 w-8 mr-2 mt-1">
									<DashboardIcon class="h-6 w-6" />
								</div>
								<a
									href={ROUTES.DASHBOARD}
									class={`ml-2 text-md w-full text-left ${
										selected === ROUTES.DASHBOARD ? 'underline' : ''
									} `}>Dashboard</a
								>
							</Button>
						</li>
					</SheetClose>
					<SheetClose asChild let:builder>
						<li class="my-3 flex items-center">
							<Button
								variant="ghost"
								class="flex items-center w-full text-xl justify-start"
								builders={[builder]}
							>
								<div class="h-8 w-8 mr-2 mt-1">
									<LoansIcon class="h-6 w-6" />
								</div>
								<a
									href={ROUTES.MY_LOANS}
									class={`ml-2 text-md w-full text-left ${
										selected === ROUTES.MY_LOANS ? 'underline' : ''
									} `}>My Loans</a
								>
							</Button>
						</li>
					</SheetClose>
					<SheetClose asChild let:builder>
						<li class="my-3 flex items-center">
							<Button
								variant="ghost"
								class="flex items-center w-full text-xl justify-start"
								builders={[builder]}
							>
								<div class="h-8 w-8 mr-2">
									<WalletIcon class="h-6 w-6" />
								</div>
								<a
									href={ROUTES.WALLET}
									class={`ml-2 text-md bold w-full text-left ${
										selected === ROUTES.WALLET ? 'underline' : ''
									} `}>Wallet</a
								>
							</Button>
						</li>
					</SheetClose>
				</ul>
				<section class="flex flex-col">
					<Separator class="my-5" />
					<div class="flex justify-between w-full items-center">
						<Button variant="ghost" class="text-xl w-full text-center" on:click={logout}
							>Logout</Button
						>
						<ThemeToggle />
					</div>
				</section>
			</SheetContent>
		</Sheet>
	</div>
	<h1 class="md:text-2xl">
		{APP_NAME}
	</h1>
	<div class="flex items-center">
		{#if address}
			<AvatarPopover />
		{:else}
			<Button variant="ghost" class="rounded-full " on:click={login}>
				<ProfileIcon class="h-6 w-6" />
			</Button>
		{/if}
	</div>
</div>
