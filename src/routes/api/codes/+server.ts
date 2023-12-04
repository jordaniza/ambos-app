import { json } from '@sveltejs/kit';
import { supabase } from '../supabaseClient.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (): Promise<Response> => {
	try {
		const { data, error } = await supabase.from('codes').select('code');

		if (error) throw error;
		if (data.length > 0) {
			const codes = data.map((d) => d.code);
			return json({ codes }, { status: 200, statusText: 'OK' });
		} else {
			return json({ message: 'No codes found' }, { status: 404, statusText: 'Not Found' });
		}
	} catch (error) {
		console.error(error);
		return json({ message: 'Internal Server Error' }, { status: 500, statusText: 'NOTOK' });
	}
};
