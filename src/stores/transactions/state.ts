import { get, writable } from 'svelte/store';
import { defaultBuilders, type TxBuilders } from './builders';
import type { EthereumAddress } from '$lib/utils';
import { LOCAL_STORAGE_KEYS, getUserStorageKey } from '$lib/constants';
import type { AppProvider } from '$stores/account';
import type { SmartAccount } from '@biconomy/account';
import { v4 } from 'uuid';

export type UUID = string;
export const makeTxId = (): UUID => v4();

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
	'REQUEST_WETH_FROM_FAUCET'
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

export const SUPPORTED_TRANSACTIONS = [
	...SUPPORTED_SINGLE_TRANSACTIONS,
	...Object.keys(SUPPORTED_BATCH_TRANSACTIONS)
] as const;

export type TxContext = {
	INCREASE_DEBT: Omit<TxBuilders['INCREASE_DEBT'], 'stage' | 'hasEth'>;
};

export type SupportedTransaction = SupportedSingleTransaction | SupportedBatchTransaction;
export type TXDetail = {
	id: UUID;
	state: TXState;
	error: string | null;
	context: TxContext[keyof TxContext] | null;
	seen: boolean;
	sponsored: boolean | null;
	createdOn: number;
	updatedOn: number;
	txType: SupportedTransaction;
	// the final tx that was sent to the blockchain and can be queried
	finalTxHash: `0x${string}` | null;
	// sponsored only - this needs to be queried from the smart account
	userOpReceiptHash: `0x${string}` | null;
	// can be queried directly from the provider
	txReceiptHash: `0x${string}` | null;
};

/**
 * @transactions - the full list of transaction and details
 * @txCounter - a counter to keep track of how many transactions have been created.
 *   the web3Store uses this as a trigger to invalidate the cache
 * @builders - cross-component transaction builders, these save user decisions across UI elements
 * @watchedTransactionIds - a list of transaction ids that are currently being watched by global UI elements
 */
export type TransactionStore = {
	transactions: {
		[id: UUID]: TXDetail;
	};
	builders: TxBuilders;
	txCounter: number;
	watchedTransactionIds: string[];
};

export function isValidTransactionType(type: string): boolean {
	return SUPPORTED_TRANSACTIONS.includes(type as any);
}

export function exists(store: TxStore, key: string): boolean {
	return get(store).transactions.hasOwnProperty(key);
}

export const txStore = writable<TransactionStore>({
	transactions: {},
	txCounter: 0,
	builders: defaultBuilders,
	watchedTransactionIds: []
});
export type TxStore = typeof txStore;

export function setNewTransaction<T extends TxContext[keyof TxContext]>(
	store: TxStore,
	type: string,
	id: string,
	context?: T | undefined
): void {
	if (!isValidTransactionType(type)) {
		throw new Error(`Invalid transaction type: ${type}`);
	}
	if (exists(store, id)) {
		throw new Error(`Transaction ${id} already exists`);
	}
	store.update((s) => {
		s.transactions[id] = {
			id,
			context: context ?? null,
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
		s.watchedTransactionIds.push(id);
		return s;
	});
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

export function writeTransactionsToLocalStorage(store: TransactionStore, address: EthereumAddress) {
	try {
		const serializedData = JSON.stringify(store.transactions);
		localStorage.setItem(getUserStorageKey(address), serializedData);
	} catch (error) {
		console.error('Could not write to local storage:', error);
	}
}

export function readTransactionsFromLocalStorage(address: EthereumAddress) {
	try {
		const serializedData = localStorage.getItem(getUserStorageKey(address));
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

/**
 * Sets up the TX Store for the user by checking if any transactions exist in storage
 */
export async function initializeTxStore(
	store: TxStore,
	address: EthereumAddress,
	provider: AppProvider,
	smartAccount: SmartAccount
): Promise<void> {
	migrateIfNeccessary(address);

	const savedTransactions = readTransactionsFromLocalStorage(address);

	if (savedTransactions) {
		store.update((s) => {
			s.transactions = {
				...savedTransactions,
				...s.transactions
			};
			return s;
		});
	}

	await getPendingTransactionUpdates(store, provider, smartAccount);
}

export function updateLocalStorageWithStoreChanges(store: TxStore, address: EthereumAddress): void {
	const currentValue = readTransactionsFromLocalStorage(address);
	if (JSON.stringify(currentValue) !== JSON.stringify(get(store).transactions)) {
		writeTransactionsToLocalStorage(get(store), address);
	}
}

function findTxByReceiptHash(transactions: TXDetail[], hash: string): TXDetail | undefined {
	return transactions.find((tx) => tx.txReceiptHash === hash || tx.userOpReceiptHash === hash);
}

function getPendingTxHashes(store: TxStore): { hash: `0x${string}`; userOp: boolean }[] {
	// get all pending transactions
	const pendingTransactions = Object.values(get(store).transactions).filter((tx) =>
		TX_STATES_SUMMARY.PENDING.includes(tx.state)
	);
	// get all tx hashes
	return pendingTransactions
		.map((tx) => ({
			hash: tx.txReceiptHash || tx.userOpReceiptHash,
			userOp: !tx.txReceiptHash
		}))
		.filter((tx) => !!tx.hash) as { hash: `0x${string}`; userOp: boolean }[];
}

async function grabSmartAccountTxReceipt(smartAccount: SmartAccount, hash: string) {
	// const { receipt } = await smartAccount.bundler.getUserOpReceipt(hash);
	const uop = await smartAccount.bundler.getUserOpReceipt(hash);
	if (!uop) return;
	return uop.receipt;
}

export async function getPendingTransactionUpdates(
	store: TxStore,
	provider: AppProvider,
	smartAccount: SmartAccount
) {
	// get all tx hashes
	const txHashes = getPendingTxHashes(store);

	// check the latest status
	const hashReceipts = await Promise.all(
		txHashes.map(async ({ hash, userOp }) => ({
			hash,
			finalReceipt: userOp
				? await grabSmartAccountTxReceipt(smartAccount, hash)
				: await provider.getTransactionReceipt(hash)
		}))
	);

	store.update((s) => {
		hashReceipts.forEach(({ hash, finalReceipt }) => {
			if (!finalReceipt) return;
			const tx = findTxByReceiptHash(Object.values(s.transactions), hash);
			if (!tx) return;

			if (finalReceipt.status === 1 && finalReceipt.confirmations > 0) {
				tx.state = 'SUCCESSFUL';
				tx.finalTxHash = finalReceipt.transactionHash as `0x${string}`;
			} else if (finalReceipt.status === 0 && finalReceipt.confirmations > 0) {
				tx.state = 'REJECTED';
				tx.finalTxHash = finalReceipt.transactionHash as `0x${string}`;
			}

			// overwrite the tx in the store if there are changes
			if (s.transactions[tx.id] !== tx) s.transactions[tx.id] = tx;
		});
		return s;
	});
}

/// @dev keep these in for a bit while we migrate to new schema

function migrateIfNeccessary(address: EthereumAddress) {
	const oldStore = checkForMigration();
	if (oldStore) {
		migrate(address, oldStore);
	}
}

export function checkForMigration(): TransactionStore['transactions'] | null {
	const oldStore = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
	if (!oldStore) {
		return null;
	}
	return JSON.parse(oldStore);
}

export function migrate(account: EthereumAddress, old: TransactionStore['transactions']): void {
	// add the id inside each tx
	Object.entries(old).forEach(([id, tx]) => {
		tx.id = id;
	});

	localStorage.setItem(getUserStorageKey(account), JSON.stringify(old));
	localStorage.removeItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
}
