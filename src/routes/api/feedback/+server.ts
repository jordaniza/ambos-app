import { json } from '@sveltejs/kit';
import { supabase } from '../supabaseClient.js';

export const POST = async ({ request }): Promise<Response> => {
	const { feedback, scw } = (await request.json()) as {
		feedback: string;
		scw: string;
	};

	const { error } = await supabase.from('feedback').insert([{ feedback, scw: scw.toLowerCase() }]);

	if (error) {
		// Handle error
		console.error(error);
		return json(
			{
				message: 'Internal Server Error'
			},
			{
				status: 500,
				statusText: 'NOTOK'
			}
		);
	}

	// Successful operation
	return json(
		{
			message: 'Successfully addee feedback to database'
		},
		{
			status: 200,
			statusText: 'OK'
		}
	);
};
