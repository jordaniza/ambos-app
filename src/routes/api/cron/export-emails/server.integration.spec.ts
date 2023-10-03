import { beforeAll, expect, test, vi } from 'vitest';
import {
	connStr,
	connectToGoogleSheets,
	connectToPostgres,
	readEmails,
	writeEmailsToGoogleSheets,
	writeValuesToGSheet
} from './export';
import { configDotenv } from 'dotenv';
import { exec } from 'child_process';

beforeAll(() => {
	configDotenv();
});

test('Test is firing', () => {
	expect(true).toBe(true);
});

test('can connect to postgres', () => {
	const sql = connectToPostgres();
	expect(sql).toBeDefined();
});

test('can read emails', async () => {
	const emails = await readEmails();
	expect(emails).toBeDefined();
	expect(emails.length).toBeGreaterThan(0);
});

test('can connect to google', () => {
	const google = connectToGoogleSheets();
	expect(google).toBeDefined();
});

test('can write to a google sheet', async () => {
	await writeEmailsToGoogleSheets();
});
