import { API_ROUTES } from '$lib/constants';
import type { EthereumAddress } from '$lib/utils';
import exp from 'constants';
import { get } from 'svelte/store';
import { writable } from 'svelte/store';

export enum TaskStatus {
	'NOT_STARTED',
	'IN_PROGRESS',
	'COMPLETED',
	'CLAIMED',
	'SKIPPED',
	'LOCKED'
}

export const NAMED_TASKS = {
	INSTALL_APP: 1,
	SET_USERNAME: 2,
	GET_REFERRAL: 3
} as const;

export type NamedTask = (typeof NAMED_TASKS)[keyof typeof NAMED_TASKS];

export type Task = {
	id: number;
	name: string;
	description: string;
	points: number;
	status?: TaskStatus;
};

type TaskCompletion = {
	taskId: number;
	status: TaskStatus;
};

export type TaskStore = {
	tasks: Task[];
};

export const taskStore = writable<TaskStore>({ tasks: [] });

export async function fetchTasks(): Promise<Task[] | null> {
	try {
		const response = await fetch(`${API_ROUTES.GET.TASKS}`);
		if (!response.ok && response.status !== 404) {
			throw new Error(`Error: ${response.statusText}`);
		} else if (response.status === 404) {
			return null;
		}
		const data = await response.json();
		return data.tasks;
	} catch (error) {
		console.warn('Failed to fetch tasks:', error);
		return null;
	}
}

export async function fetchTaskCompletions(
	address: EthereumAddress
): Promise<TaskCompletion[] | null> {
	try {
		const response = await fetch(
			`${API_ROUTES.GET.TASK_COMPLETIONS}?scw=${encodeURIComponent(address)}`
		);
		if (!response.ok && response.status !== 404) {
			throw new Error(`Error: ${response.statusText}`);
		} else if (response.status === 404) {
			return null;
		}
		const data = await response.json();
		return data.taskCompletions;
	} catch (error) {
		console.warn('Failed to fetch task completions:', error);
		return null;
	}
}

export async function fetchTasksAndCompletions(address: EthereumAddress): Promise<Task[] | null> {
	const [tasks, completions] = await Promise.all([fetchTasks(), fetchTaskCompletions(address)]);
	if (!tasks || !completions) return null;
	return tasks.map((task) => {
		const completion = completions.find((c) => c.taskId === task.id);
		return {
			...task,
			status: completion?.status ?? TaskStatus['NOT_STARTED']
		};
	});
}

export async function initializeTaskStore(
	store: typeof taskStore,
	address: EthereumAddress
): Promise<void> {
	const tasks = await fetchTasksAndCompletions(address);
	if (tasks) {
		store.set({ tasks });
	}
}

export async function completeTaskDB(scw: EthereumAddress, taskId: number, status: TaskStatus) {
	const requestBody = {
		scw,
		taskId,
		status
	};

	const response = await fetch(`${API_ROUTES.POST.TASK_COMPLETIONS}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});

	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}

	return response.status;
}

export function completeTaskStore(store: typeof taskStore, task: NamedTask) {
	const tasks = get(store).tasks;
	const taskIndex = tasks.findIndex((t) => t.id === task);
	if (taskIndex === -1) throw new Error('Task not found');
	tasks[taskIndex].status = TaskStatus.COMPLETED;
	store.set({ tasks });
}

export async function completeTask(
	store: typeof taskStore,
	taskId: NamedTask,
	scw: EthereumAddress
) {
	const tasks = get(store).tasks;
	const taskIndex = tasks.findIndex((t) => t.id === taskId);
	if (taskIndex === -1) console.error('Task not found');
	const task = tasks[taskIndex];
	if (task.status === TaskStatus.COMPLETED) return;

	const status = TaskStatus.COMPLETED;
	const dbResponse = await completeTaskDB(scw, taskId, status);
	if (dbResponse === 200) {
		completeTaskStore(store, taskId);
	}
}
