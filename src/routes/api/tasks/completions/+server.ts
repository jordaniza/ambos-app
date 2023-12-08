import { json } from '@sveltejs/kit';
import { supabase } from '../../supabaseClient.js';
import { DB_TABLES } from '$lib/constants.js';

export const GET = async ({ request }): Promise<Response> => {
	const url = new URL(request.url);
	const scw = url.searchParams.get('scw');

	if (!scw) {
		return json(
			{ message: 'SCW parameter is required' },
			{ status: 400, statusText: 'Bad Request' }
		);
	}

	try {
		const { data, error } = await supabase
			.from(DB_TABLES.TASK_COMPLETIONS)
			.select('*')
			.eq('scw', scw.toLowerCase());

		if (error) throw error;

		if (!data) {
			return json(
				{ message: 'No task completions found' },
				{ status: 404, statusText: 'Not Found' }
			);
		}

		return json({ taskCompletions: data }, { status: 200, statusText: 'OK' });
	} catch (error) {
		console.error(error);
		return json({ message: 'Internal Server Error' }, { status: 500, statusText: 'NOTOK' });
	}
};

export const POST = async ({ request }): Promise<Response> => {
	const requestBody = await request.json();

	if (!requestBody) {
		return json({ message: 'Body is required' }, { status: 400, statusText: 'Bad Request' });
	}

	const { scw, taskId, status } = requestBody;

	if (!scw || !taskId || !status) {
		return json(
			{ message: 'SCW, taskId, and status are required' },
			{ status: 400, statusText: 'Bad Request' }
		);
	}

	try {
		const { error } = await supabase.from(DB_TABLES.TASK_COMPLETIONS).upsert(
			{
				scw: scw.toLowerCase(),
				task_id: taskId,
				status
			},
			{
				onConflict: 'scw, task_id'
			}
		);

		if (error) throw error;

		return json({ message: 'OK' }, { status: 200, statusText: 'OK' });
	} catch (error) {
		console.error(error);
		return json({ message: 'Internal Server Error' }, { status: 500, statusText: 'NOTOK' });
	}
};
