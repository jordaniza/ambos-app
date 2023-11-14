<script lang="ts">
	import { page } from '$app/stores';
	import { CheckIcon } from 'lucide-svelte';
	import type { Step } from '.';

	export let steps: Step[];

	function getSelectedIndex() {
		const currentPage = $page.route.id;
		return steps.findIndex((step) => currentPage === step.route);
	}

	$: selectedIndex = getSelectedIndex();

	function getTextColor(i: number) {
		if (selectedIndex === i) {
			return ' text-black';
		} else if (selectedIndex > i) {
			return ' text-primary';
		} else {
			return ' text-muted-foreground';
		}
	}

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
			<div class="flex flex-col items-center w-full">
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
						class={`${getTextColor(i)} text-sm text-center ` +
							(selectedIndex === i ? 'font-bold  ' : '')}
					>
						{step.name}
					</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
