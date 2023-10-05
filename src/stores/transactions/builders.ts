import type { TxStore } from './state';

/**
 * Tx builders are transactions being built across various parts of the UI
 * They are not yet submitted to the blockchain as full transactions
 */
export type TxBuilders = {
	INCREASE_DEBT: {
		// whether or not the user has ETH
		hasEth: boolean;
		// how much ETH the user wants to supply/deposit
		ethToSupply: number;
		// how much USD stablecoin the user wants to borrow
		usdToBorrow: number;
		// which stage of the loan workflow the user is on
		stage: 'calculate' | 'transfer' | 'review';
	};
};

const defaultIncreaseDebtBuilder: TxBuilders['INCREASE_DEBT'] = {
	hasEth: false,
	ethToSupply: 0,
	usdToBorrow: 0,
	stage: 'calculate'
};

export const defaultBuilders: TxBuilders = {
	INCREASE_DEBT: defaultIncreaseDebtBuilder
};

export function setSupplyEth(store: TxStore, supplyEth: number): void {
	store.update((s) => {
		s.builders['INCREASE_DEBT'].ethToSupply = supplyEth;
		return s;
	});
}

export function setBorrowUsd(store: TxStore, borrowUsd: number): void {
	store.update((s) => {
		s.builders['INCREASE_DEBT'].usdToBorrow = borrowUsd;
		return s;
	});
}

export function setHasEth(store: TxStore, hasEth: boolean): void {
	store.update((s) => {
		s.builders['INCREASE_DEBT'].hasEth = hasEth;
		return s;
	});
}

export function setIncreaseDebtBuilderStage(
	store: TxStore,
	stage: TxBuilders['INCREASE_DEBT']['stage']
): void {
	store.update((s) => {
		s.builders['INCREASE_DEBT'].stage = stage;
		return s;
	});
}

export function resetBuilders(store: TxStore) {
	store.update((s) => {
		s.builders = defaultBuilders;
		return s;
	});
}
