<script lang="ts">
	import { ROUTES } from '$lib/constants';
	import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import NotificationCircle from '$lib/components/ui/notifcationCircle/notificationCircle.svelte';
</script>

<Popover>
	<PopoverTrigger asChild let:builder>
		<Button variant="outline" class="relative rounded-full md:text-2xl" builders={[builder]}>
			JA
			<NotificationCircle />
		</Button>
	</PopoverTrigger>
	<PopoverContent class="w-40 md:w-80">
		<div class="grid gap-2">
			<div class="space-y-2">
				<h4 class="font-medium leading-none md:text-xl">Status</h4>
				<p class="text-sm md:text-lg text-muted-foreground">Connected</p>
			</div>
			<Button variant="secondary" class="w-full">
				<a href={ROUTES.PROFILE} class="w-full md:text-xl">My Profile</a>
			</Button>
			<Button variant="outline" class="w-full relative">
				<NotificationCircle position="-top-1 -right-1" />
				<a href={ROUTES.HISTORY} class="w-full md:text-xl">History</a>
			</Button>
		</div>
	</PopoverContent>
</Popover>
