import { get, writable, type Writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

export type UUID = string;

/// fine grained for specific components
export const TX_STATES = [
	'STARTED',
	'SIGNING',
	'SIGNED',
	'REJECTED',
	'SUCCESSFUL',
	'FAILED'
] as const;

export type TXState = (typeof TX_STATES)[number];
export type TXStateGroup = 'PENDING' | 'FULFILLED' | 'REJECTED';

export const TX_STATES_SUMMARY: Record<TXStateGroup, readonly TXState[]> = {
	PENDING: ['STARTED', 'SIGNING', 'SIGNED'],
	FULFILLED: ['SUCCESSFUL'],
	REJECTED: ['REJECTED', 'FAILED']
};

export const SUPPORTED_SINGLE_TRANSACTIONS = [
	// increase debt
	'APPROVE_WETH',
	'SUPPLY_WETH',
	'BORROW_USDC',

	// decrease debt
	'APPROVE_AWETH',
	'REPAY_USDC',
	'WITHDRAW_WETH',

	// eth/weth
	'UNWRAP_WETH',
	'WRAP_WETH',

	// swaps
	'SWAP_WETH_USDC',
	'SWAP_USDC_WETH',

	'SWAP_WETH_ETH',
	'SWAP_ETH_WETH',

	'SWAP_ETH_USDC',
	'SWAP_USDC_ETH',

	// send tokens
	'SEND_USDC',
	'SEND_WETH',
	'SEND_ETH',

	// request tokens
	'REQUEST_WETH_FROM_FAUCET',

	// bridging
	'BRIDGE_ETH'
] as const;

export type SupportedSingleTransaction = (typeof SUPPORTED_SINGLE_TRANSACTIONS)[number];
export type SupportedBatchTransaction = 'INCREASE_DEBT' | 'DECREASE_DEBT';

export const SUPPORTED_BATCH_TRANSACTIONS: Record<
	SupportedBatchTransaction,
	readonly SupportedSingleTransaction[]
> = {
	INCREASE_DEBT: ['APPROVE_WETH', 'SUPPLY_WETH', 'BORROW_USDC'],
	DECREASE_DEBT: ['APPROVE_AWETH', 'REPAY_USDC', 'WITHDRAW_WETH']
} as const;

const SUPPORTED_TRANSACTIONS = [
	...SUPPORTED_SINGLE_TRANSACTIONS,
	...Object.keys(SUPPORTED_BATCH_TRANSACTIONS)
] as const;

export type SupportedTransaction = SupportedSingleTransaction | SupportedBatchTransaction;
export type TXDetail = {
	state: TXState;
	error: string | null;
	notes: string | null;
	seen: boolean;
	sponsored: boolean | null;
	createdOn: number;
	updatedOn: number;
	txType: SupportedTransaction;
	finalTxHash: `0x${string}` | null;
	// sponsored only
	userOpReceiptHash: `0x${string}` | null;
	// not sponsored only
	txReceiptHash: `0x${string}` | null;
};

export type TransactionStore = {
	transactions: {
		[id: UUID]: TXDetail;
	};
	txCounter: number;
};

export function isValidTransactionType(type: string): boolean {
	return SUPPORTED_TRANSACTIONS.includes(type as any);
}

export function exists(store: TxStore, key: string): boolean {
	let hasKey = false;
	store.subscribe((s) => {
		hasKey = s.transactions.hasOwnProperty(key);
	})();
	return hasKey;
}

export const txStore = writable<TransactionStore>({
	transactions: {},
	// the tx counter triggers can be subscribed to and other components or stores can react to it
	txCounter: 0
});
export type TxStore = typeof txStore;

export function setNewTransaction(store: TxStore, type: string): UUID {
	if (!isValidTransactionType(type)) {
		throw new Error(`Invalid transaction type: ${type}`);
	}
	const id = uuid();
	store.update((s) => {
		s.transactions[id] = {
			notes: null,
			error: null,
			finalTxHash: null,
			seen: false,
			createdOn: Date.now(),
			updatedOn: Date.now(),
			sponsored: null,
			txType: type as SupportedTransaction,
			txReceiptHash: null,
			state: 'STARTED',
			userOpReceiptHash: null
		};
		return { ...s };
	});
	return id;
}

export function updateTransaction(store: TxStore, id: UUID, detail: Partial<TXDetail>): void {
	if (!exists(txStore, id)) {
		throw new Error(`Transaction ${id} does not exist`);
	}

	if (detail.txType && !isValidTransactionType(detail.txType)) {
		throw new Error(`Invalid transaction type: ${detail.txType}`);
	}
	store.update((s) => {
		s.transactions[id] = {
			...s.transactions[id],
			...detail,
			updatedOn: Date.now()
		};
		return s;
	});
}

// Retrieve transactions of a given type from txStore
export function getTransactionsOfType(store: TransactionStore, type: string): TXDetail[] {
	if (!isValidTransactionType(type)) {
		throw new Error(`Invalid transaction type: ${type}`);
	}
	return Object.values(store.transactions).filter((tx) => tx.txType === type);
}

// Retrieve the latest transaction of a given type from txStore
export function getLatestTransactionOfType(
	store: TransactionStore,
	type: SupportedTransaction
): TXDetail | undefined {
	if (!store.transactions) return;
	const allTransactions = getTransactionsOfType(store, type);
	let latestTransaction: TXDetail | undefined;
	if (allTransactions.length) {
		// Sort transactions by createdOn in descending order to get the latest transaction
		allTransactions.sort((a, b) => b.createdOn - a.createdOn);
		latestTransaction = allTransactions[0];
	}
	return latestTransaction;
}

export function writeTransactionsToLocalStorage(store: TransactionStore) {
	try {
		const serializedData = JSON.stringify(store.transactions);
		localStorage.setItem('transactions', serializedData);
	} catch (error) {
		console.error('Could not write to local storage:', error);
	}
}

export function readTransactionsFromLocalStorage() {
	try {
		const serializedData = localStorage.getItem('transactions');
		if (serializedData === null) {
			return undefined;
		}
		return JSON.parse(serializedData);
	} catch (error) {
		console.error('Could not read from local storage:', error);
		return undefined;
	}
}

export function setTxToSeen(store: TxStore, id: UUID) {
	updateTransaction(store, id, { seen: true });
}

export function setAllTxToSeen(store: TxStore) {
	Object.keys(get(store)).forEach((id) => {
		setTxToSeen(store, id);
	});
}

export function increaseTxCounter(store: TxStore) {
	store.update((s) => {
		s.txCounter++;
		return s;
	});
}
