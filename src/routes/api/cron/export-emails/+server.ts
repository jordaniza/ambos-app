import { json } from '@sveltejs/kit';
import { writeEmailsToGoogleSheets } from './export';

export function GET(): Response {
	return json({
		message: 'API is alive'
	});
}

export async function POST(): Promise<Response> {
	try {
		await writeEmailsToGoogleSheets();
		return json({
			message: 'Emails exported'
		});
	} catch (e) {
		console.error(e);
		return json({
			message: 'Error exporting emails'
		});
	}
}
