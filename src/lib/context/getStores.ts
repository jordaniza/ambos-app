import type { SmartAccountStore } from '$stores/account';
import type { TransactionStore, TransactionStoreDerived } from '$stores/transactions/state';
import type { Web3Store } from '$stores/web3';
import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';

export const WEB3_KEY = Symbol('web3');
export const ACCOUNT_KEY = Symbol('account');
export const TX_KEY = Symbol('tx');
export const TX_KEY_FULL = Symbol('txFull');

export const getWeb3Store = (): Writable<Web3Store> => getContext(WEB3_KEY);
export const getAccountStore = (): Writable<SmartAccountStore> => getContext(ACCOUNT_KEY);
export const getTxStore = (): Writable<TransactionStoreDerived> => getContext(TX_KEY);
export const getTxFullStore = (): Writable<TransactionStore> => getContext(TX_KEY_FULL);
