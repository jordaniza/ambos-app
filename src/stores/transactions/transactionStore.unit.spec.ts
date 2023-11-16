/// @vitest-environment jsdom

import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
	migrate,
	type TXDetail,
	type TransactionStore,
	getPendingTransactionUpdates,
	txStore
} from './state';
import { getUserStorageKey } from '$lib/constants';
import { get } from 'svelte/store';

const txs: TransactionStore['transactions'] = {
	'139b8403-682d-41ba-8ffb-d7bf63cfa313': {
		id: '139b8403-682d-41ba-8ffb-d7bf63cfa313',
		context: null,
		error: 'User not login',
		finalTxHash: null,
		seen: false,
		createdOn: 1697110433451,
		updatedOn: 1697110438427,
		sponsored: null,
		txType: 'INCREASE_DEBT',
		txReceiptHash: null,
		state: 'FAILED',
		userOpReceiptHash: null
	},
	'f071a173-56e3-4bde-aa38-1d108ffa5658': {
		id: 'f071a173-56e3-4bde-aa38-1d108ffa5658',
		context: null,
		error: null,
		finalTxHash: '0xd1',
		seen: false,
		createdOn: 1697115888396,
		updatedOn: 1697115902430,
		sponsored: true,
		txType: 'INCREASE_DEBT',
		txReceiptHash: null,
		state: 'SUCCESSFUL',
		userOpReceiptHash: '0xf2b'
	},
	'a071a173-56e3-4bde-aa38-1d108ffa5658': {
		id: 'a071a173-56e3-4bde-aa38-1d108ffa5658',
		context: null,
		error: null,
		finalTxHash: null,
		seen: false,
		createdOn: 1697115888396,
		updatedOn: 1697115902430,
		sponsored: false,
		txType: 'INCREASE_DEBT',
		txReceiptHash: '0xa2b',
		state: 'SIGNED',
		userOpReceiptHash: null
	},
	'b071a173-56e3-4bde-aa38-1d108ffa5658': {
		id: 'b071a173-56e3-4bde-aa38-1d108ffa5658',
		context: null,
		error: null,
		finalTxHash: null,
		seen: false,
		createdOn: 1697115888396,
		updatedOn: 1697115902430,
		sponsored: false,
		txType: 'INCREASE_DEBT',
		txReceiptHash: '0xb2b',
		state: 'SIGNED',
		userOpReceiptHash: null
	}
};

describe('TxStore Migrations', () => {
	beforeEach(() => {
		localStorage.setItem('transactions', JSON.stringify(txs));
	});

	test('Migrating to the new schema', () => {
		const mockEthereumAddress = '0xcC49883Fd5320BE420d4F31B1fB05866F1BAAA80';

		const fetchedStore = localStorage.getItem('transactions');
		expect(fetchedStore).toBeTruthy();

		const oldStore = JSON.parse(fetchedStore as string);
		expect(oldStore).to.deep.eq(txs);

		migrate(mockEthereumAddress, oldStore);

		expect(localStorage.getItem('transactions')).to.be.null;

		const newStore = JSON.parse(
			localStorage.getItem(getUserStorageKey(mockEthereumAddress)) as string
		);

		expect(newStore).to.deep.eq(oldStore);
	});
});

describe('getPendingTransactionUpdates', () => {
	test('should update pending transactions with latest state', async () => {
		const store = txStore;
		store.update((s) => {
			s.transactions = txs;
			return s;
		});

		const provider = {
			getTransactionReceipt: vi.fn().mockImplementation((hash) => {
				if (hash === '0xb2b') {
					return Promise.resolve({ transactionHash: '0x123', status: 1, confirmations: 1 });
				} else if (hash === '0xa2b') {
					return Promise.resolve({ transactionHash: '0x456', status: 0, confirmations: 1 });
				} else {
					return Promise.reject(new Error(`Transaction not found: ${hash}`));
				}
			})
		};

		const smartAccount = {
			bundler: {
				getUserOpReceipt: vi.fn().mockImplementation((hash) => {
					if (hash === '0xb2b') {
						return Promise.resolve({ transactionHash: '0x123', status: 1, confirmations: 1 });
					} else if (hash === '0xa2b') {
						return Promise.resolve({ transactionHash: '0x456', status: 0, confirmations: 1 });
					} else {
						return Promise.reject(new Error(`Transaction not found: ${hash}`));
					}
				})
			}
		};

		await getPendingTransactionUpdates(store, provider as any, smartAccount as any);

		expect(get(store).transactions).toEqual({
			'139b8403-682d-41ba-8ffb-d7bf63cfa313': {
				id: '139b8403-682d-41ba-8ffb-d7bf63cfa313',
				notes: null,
				error: 'User not login',
				finalTxHash: null,
				seen: false,
				createdOn: 1697110433451,
				updatedOn: 1697110438427,
				sponsored: null,
				txType: 'INCREASE_DEBT',
				txReceiptHash: null,
				state: 'FAILED',
				userOpReceiptHash: null
			},
			'f071a173-56e3-4bde-aa38-1d108ffa5658': {
				id: 'f071a173-56e3-4bde-aa38-1d108ffa5658',
				notes: null,
				error: null,
				finalTxHash: '0xd1',
				seen: false,
				createdOn: 1697115888396,
				updatedOn: 1697115902430,
				sponsored: true,
				txType: 'INCREASE_DEBT',
				txReceiptHash: null,
				state: 'SUCCESSFUL',
				userOpReceiptHash: '0xf2b'
			},
			'a071a173-56e3-4bde-aa38-1d108ffa5658': {
				id: 'a071a173-56e3-4bde-aa38-1d108ffa5658',
				notes: null,
				error: null,
				finalTxHash: '0x456',
				seen: false,
				createdOn: 1697115888396,
				updatedOn: 1697115902430,
				sponsored: false,
				txType: 'INCREASE_DEBT',
				txReceiptHash: '0xa2b',
				state: 'REJECTED',
				userOpReceiptHash: null
			},
			'b071a173-56e3-4bde-aa38-1d108ffa5658': {
				id: 'b071a173-56e3-4bde-aa38-1d108ffa5658',
				context: null,
				error: null,
				finalTxHash: '0x123',
				seen: false,
				createdOn: 1697115888396,
				updatedOn: 1697115902430,
				sponsored: false,
				txType: 'INCREASE_DEBT',
				txReceiptHash: '0xb2b',
				state: 'SUCCESSFUL',
				userOpReceiptHash: null
			} as TXDetail
		});
	});
});
