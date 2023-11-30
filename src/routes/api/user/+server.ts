import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { json } from '@sveltejs/kit';
import { SUPABASE_APP_ENDPOINT, SUPABASE_ADMIN_PASSWORD } from '$env/static/private';

export const POST = async ({ request }): Promise<Response> => {
	const url = SUPABASE_APP_ENDPOINT;
	const key = SUPABASE_ADMIN_PASSWORD;

	if (!url) throw new Error('SUPABASE_APP_ENDPOINT must be set');
	if (!key) throw new Error('SUPABASE_ADMIN_PASSWORD must be set');
	const supabase: SupabaseClient = createClient(url, key);

	const { signerAddress, smartAccountAddress } = (await request.json()) as {
		signerAddress: string;
		smartAccountAddress: string;
	};

	const { error } = await supabase
		.from('smartAccounts')
		.upsert([{ eoa: signerAddress.toLowerCase(), scw: smartAccountAddress.toLowerCase() }], {
			onConflict: 'eoa'
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
