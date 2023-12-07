import { json } from '@sveltejs/kit';
import { supabase } from '../supabaseClient.js';
import { DB_TABLES } from '$lib/constants.js';

export const GET = async (): Promise<Response> => {
	try {
		const { data, error } = await supabase.from(DB_TABLES.TASKS).select('*');

		if (error) throw error;

		if (!data) {
			return json({ message: 'No tasks found' }, { status: 404, statusText: 'Not Found' });
		}

		return json({ tasks: data }, { status: 200, statusText: 'OK' });
	} catch (error) {
		console.error(error);
		return json({ message: 'Internal Server Error' }, { status: 500, statusText: 'NOTOK' });
	}
};
