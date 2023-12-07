<script lang="ts">
	import { browser } from '$app/environment';
	import Card from '$lib/components/ui/card/card.svelte';
	import { API_ROUTES } from '$lib/constants';
	import { getAccountStore, getTaskStore } from '$lib/context/getStores';
	import { NAMED_TASKS, TaskStatus } from '$stores/tasks';
	import { taskGetReferral, taskInstallApp, taskSetUsername } from '$stores/tasks/completions';
	import { CheckCircle2Icon } from 'lucide-svelte';

	let taskStore = getTaskStore();
	let accountStore = getAccountStore();
	let referralCode: string | null = null;

	$: address = $accountStore.address;
	$: username = $accountStore.username;
	$: tasks = $taskStore?.tasks ?? [];
	$: maxPoints = tasks?.reduce((acc, task) => acc + task.points, 0) ?? 0;
	$: currentPoints =
		tasks?.reduce((acc, task) => {
			if (task.status === TaskStatus.COMPLETED) return acc + task.points;
			else return acc;
		}, 0) ?? 0;

	$: progress = currentPoints ? (maxPoints / currentPoints) * 100 : 0;

	$: taskUsername = tasks.find((task) => task.id === NAMED_TASKS.SET_USERNAME);
	$: taskInstall = tasks.find((task) => task.id === NAMED_TASKS.INSTALL_APP);
	$: taskReferral = tasks.find((task) => task.id === NAMED_TASKS.GET_REFERRAL);

	$: {
		if (taskUsername && taskUsername.status !== TaskStatus.COMPLETED && address && username) {
			taskSetUsername(taskStore, address, username);
		}
	}

	$: {
		if (taskInstall && taskInstall.status !== TaskStatus.COMPLETED && address) {
			taskInstallApp(taskStore, address);
		}
	}

	$: {
		if (taskReferral && taskReferral.status !== TaskStatus.COMPLETED && address && referralCode) {
			taskGetReferral(taskStore, address, referralCode);
		}
	}

	$: {
		if (browser && address) {
			fetchReferral(address).then((code) => {
				if (code) {
					referralCode = code;
				}
			});
		}
	}

	async function fetchReferral(scw: string): Promise<string | null> {
		try {
			const response = await fetch(`${API_ROUTES.GET.REFERRAL}?scw=${encodeURIComponent(scw)}`);
			if (!response.ok && response.status !== 404) {
				throw new Error(`Error: ${response.statusText}`);
			} else if (response.status === 404) {
				return null;
			}
			const data = await response.json();
			return data.referralCode;
		} catch (error) {
			console.warn('Failed to fetch referral code:', error);
			return null;
		}
	}
</script>

<Card variant="popover" class="flex flex-col gap-3 items-center p-4">
	<p class="text-start w-full font-bold text-sm">Your Journey With Ambos</p>

	<section class="w-full px-1 flex flex-col gap-1">
		<div class="flex w-full text-xs justify-between">
			<p class="text-secondary">Level 0</p>
			<p>{maxPoints - currentPoints} Points to Level 1</p>
		</div>
		<div class="flex-shrink w-full items-center justify-center">
			<div class="bg-gray-200 rounded-full h-2 w-full relative">
				<div class="bg-secondary rounded-full h-full" style={`width: ${progress}%;`} />
			</div>
		</div>
	</section>

	<section class="flex flex-col w-full gap-2">
		{#each tasks as task}
			<Card
				class="flex justify-between gap-1 py-2 px-4 text-xs shadow-none rounded-xl bg-background items-center"
			>
				<div>
					<p class="font-bold">{task.name}</p>
					<p>{task.description}</p>
				</div>
				{#if task.status === TaskStatus.COMPLETED}
					<CheckCircle2Icon class="text-primary" />
				{:else}
					<div>
						{task.points}
					</div>
				{/if}
			</Card>
		{/each}
	</section>
</Card>
