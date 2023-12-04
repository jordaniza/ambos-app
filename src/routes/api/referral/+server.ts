import { json } from '@sveltejs/kit';
import { supabase } from '../supabaseClient.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }): Promise<Response> => {
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
			.from('referrals')
			.select('*')
			.eq('scw', scw.toLowerCase())
			.order('created_at', { ascending: false })
			.limit(1);

		if (error) throw error;

		if (data.length === 0) {
			return json(
				{ message: 'No referral code found for the provided SCW' },
				{ status: 404, statusText: 'Not Found' }
			);
		}

		return json({ referralCode: data[0].code_used }, { status: 200, statusText: 'OK' });
	} catch (error) {
		console.error(error);
		return json({ message: 'Internal Server Error' }, { status: 500, statusText: 'NOTOK' });
	}
};

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
	try {
		const requestBody = await request.json();
		const { scw, referralCode } = requestBody;

		// Basic validation
		if (!scw || !referralCode) {
			return json(
				{ message: 'SCW and referral code are required' },
				{ status: 400, statusText: 'Bad Request' }
			);
		}

		// Insert or update the referral code
		const { error } = await supabase
			.from('referrals')
			.upsert({ scw: scw.toLowerCase(), code_used: referralCode }, { onConflict: 'scw' });

		if (error) throw error;

		return json(
			{ message: 'Referral code successfully updated' },
			{ status: 200, statusText: 'OK' }
		);
	} catch (error) {
		console.error(error);
		return json({ message: 'Internal Server Error' }, { status: 500, statusText: 'NOTOK' });
	}
};
