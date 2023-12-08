import { json } from '@sveltejs/kit';
import { supabase } from '../supabaseClient.js';
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
			.from(DB_TABLES.USERS)
			.select('*')
			.eq('scw', scw.toLowerCase())
			.order('created_at', { ascending: false })
			.limit(1);

		if (error) throw error;

		if (!data) {
			return json(
				{ message: 'No user details found for the provided SCW' },
				{ status: 404, statusText: 'Not Found' }
			);
		}

		return json({ user: data[0] }, { status: 200, statusText: 'OK' });
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

	const { username, scw } = requestBody;

	if (!username || !scw) {
		return json(
			{ message: 'Username and SCW are required' },
			{ status: 400, statusText: 'Bad Request' }
		);
	}

	try {
		const { error } = await supabase.from(DB_TABLES.USERS).insert({
			scw: scw.toLowerCase(),
			username
		});

		if (error) throw error;

		return json({ message: 'User details updated' }, { status: 200, statusText: 'OK' });
	} catch (error) {
		console.error(error);
		return json({ message: 'Internal Server Error' }, { status: 500, statusText: 'NOTOK' });
	}
};

export const PATCH = async ({ request }): Promise<Response> => {
	const requestBody = await request.json();

	if (!requestBody) {
		return json({ message: 'Body is required' }, { status: 400, statusText: 'Bad Request' });
	}

	const { username, scw } = requestBody;

	if (!username || !scw) {
		return json(
			{ message: 'Username and SCW are required' },
			{ status: 400, statusText: 'Bad Request' }
		);
	}

	try {
		const { error } = await supabase
			.from(DB_TABLES.USERS)
			.update({ username })
			.eq('scw', scw.toLowerCase());

		if (error) throw error;

		return json({ message: 'User details updated' }, { status: 200, statusText: 'OK' });
	} catch (error) {
		console.error(error);
		return json({ message: 'Internal Server Error' }, { status: 500, statusText: 'NOTOK' });
	}
};
