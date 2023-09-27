import postgres, { type Sql } from 'postgres';
import { google } from 'googleapis';
import * as privateEnv from '$env/static/private';
import * as publicEnv from '$env/static/public';

const not = (str: string): boolean => !str || str === '';

export function connStr(): string {
	const password = privateEnv.SUPABASE_API_USER_PASSWORD;
	if (not(password)) throw new Error('SUPABASE_API_USER_PASSWORD must be set');

	const { PUBLIC_SUPABASE_URL: url, PUBLIC_SUPABASE_USER: user } = publicEnv;

	if (not(url)) throw new Error('PUBLIC_SUPABASE_URL must be set');
	if (not(user)) throw new Error('PUBLIC_SUPABASE_USER must be set');

	return `postgres://${user}:${password}@${url}`;
}

// read from db
export function connectToPostgres(): Sql<{}> {
	const connectionString = connStr();
	return postgres(connectionString);
}

export async function readEmails(): Promise<[string, string][]> {
	const sql = connectToPostgres();
	const emails = await sql`SELECT email, created_at FROM emails`;
	return emails.map((e) => [e.email, e.created_at]);
}

export function connectToGoogleSheets() {
	const GOOGLE_SHEETS_CREDENTIALS = JSON.parse(privateEnv.GOOGLE_CREDENTIALS!);
	const client = new google.auth.JWT(
		GOOGLE_SHEETS_CREDENTIALS.client_email,
		undefined,
		GOOGLE_SHEETS_CREDENTIALS.private_key,
		['https://www.googleapis.com/auth/spreadsheets']
	);

	return google.sheets({ version: 'v4', auth: client });
}

export async function writeValuesToGSheet(values: unknown, range = 'Sheet1!A:B') {
	const google = connectToGoogleSheets();
	const spreadsheetId = '1Zx-80GTviwhG0cESchJA4wQEJMzIJYpBQTWjyW7C_oQ';
	return await google.spreadsheets.values.update({
		spreadsheetId,
		range,
		valueInputOption: 'USER_ENTERED',
		resource: { values }
	});
}

export async function writeEmailsToGoogleSheets() {
	const emails = await readEmails();
	const headers = [['email', 'created_at']];
	await writeValuesToGSheet([...headers, ...emails]);
}
