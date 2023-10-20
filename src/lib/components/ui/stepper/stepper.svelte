<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { CheckCircle2Icon, CheckIcon } from 'lucide-svelte';
	import type { Step } from '.';

	export let steps: Step[];

	function getSelectedIndex() {
		const currentPage = $page.url.href;
		return steps.findIndex((step) => currentPage.includes(step.route)) || 0;
	}

	$: selectedIndex = getSelectedIndex();

	function getColor(i: number) {
		if (selectedIndex === i) {
			return ' bg-secondary';
		} else if (selectedIndex > i) {
			return ' bg-primary';
		} else {
			return ' bg-gray-400';
		}
	}
</script>

{#if steps}
	<div class="flex w-full">
		{#each steps as step, i}
			<div
				tabindex="0"
				on:keypress={(e) => {
					if (e.key === 'right') {
						const newKey = Math.max(i + 1, steps.length - 1);
						goto(steps[newKey].route);
					} else if (e.key === 'left') {
						goto(steps[Math.max(i - 1, 0)].route);
					}
				}}
				class="flex flex-col items-center w-full cursor-pointer"
				role="button"
				on:click={() => goto(step.route)}
				aria-label="clickable stepper"
			>
				<div class="relative w-full flex items-center justify-center">
					<div
						class={'z-10 flex justify-center items-center rounded-full bg-background ' +
							(selectedIndex === i ? ' border-[2px] border-secondary w-11 h-11' : 'w-10 h-10 mt-1')}
					>
						<div
							class={'z-20 flex justify-center items-center w-8 h-8 rounded-full text-white' +
								getColor(i)}
						>
							{#if selectedIndex > i}
								<CheckIcon class="w-5 h-5" />
							{:else}
								{i + 1}
							{/if}
						</div>
					</div>
					<div class={'absolute top-1/2 transform h-0.5 w-10/12 left-1/6 z-0' + getColor(i)} />
				</div>
				<div class="flex justify-center items-center mt-3">
					<p
						class={'text-muted-foreground text-sm text-center ' +
							(selectedIndex === i ? 'font-bold text-accent-foreground ' : '')}
					>
						{step.name}
					</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
