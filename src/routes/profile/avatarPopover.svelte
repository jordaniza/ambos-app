<script lang="ts">
	import { ROUTES } from '$lib/constants';
	import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
</script>

<Popover>
	<PopoverTrigger asChild let:builder>
		<Button variant="outline" class="rounded-full" builders={[builder]}>
      JA 
    </Button>
	</PopoverTrigger>
	<PopoverContent class="w-40">
		<div class="grid gap-4">
			<div class="space-y-2">
				<h4 class="font-medium leading-none">Status</h4>
				<p class="text-sm text-muted-foreground">Connected</p>
			</div>
			<Button variant="secondary" class="w-full">
				<a href={ROUTES.PROFILE} class="w-full"> My Profile </a>
			</Button>
		</div>
	</PopoverContent>
</Popover>
