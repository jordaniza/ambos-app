import { json } from '@sveltejs/kit';
import { supabase } from '../supabaseClient.js';
import { DB_TABLES } from '$lib/constants.js';

export const POST = async ({ request }): Promise<Response> => {
	const { signerAddress, smartAccountAddress } = (await request.json()) as {
		signerAddress: string;
		smartAccountAddress: string;
	};

	const { error } = await supabase
		.from(DB_TABLES.SMART_ACCOUNTS)
		.upsert([{ eoa: signerAddress.toLowerCase(), scw: smartAccountAddress.toLowerCase() }], {
			onConflict: 'scw'
		})
		.single();

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
			message: 'Successfully wrote to database'
		},
		{
			status: 200,
			statusText: 'OK'
		}
	);
};
