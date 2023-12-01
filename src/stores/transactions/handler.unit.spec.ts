import { expect, it, test } from 'vitest';
import receipts from './receipt-mock';
import { userOpSuccess } from './handler';

test('Event Filtering', () => {
	expect(userOpSuccess(receipts.succeeded.receipt as any)).toBe(true);
	expect(userOpSuccess(receipts.failed.receipt as any)).toBe(false);
});
