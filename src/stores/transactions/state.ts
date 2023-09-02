import { derived, writable } from "svelte/store";

/// fine grained for specific components
export const TX_STATES_FULL = [
  "STARTED",
  "SIGNING",
  "SIGNED",
  "CONFIRMED",
  "REJECTED",
  "SUCCESSFUL",
  "FAILED",
] as const;

export type TXStateFull = typeof TX_STATES_FULL[number];

/// most components will use these

export type TXState = "PENDING" | "FULFILLED" | "REJECTED";
export const TX_STATES: Record<TXState, readonly TXStateFull[]> = {
  PENDING: ["STARTED", "SIGNING", "SIGNED", "CONFIRMED"],
  FULFILLED: ["SUCCESSFUL"],
  REJECTED: ["REJECTED", "FAILED"],
};

type TXDetailFull = {
  state: TXStateFull;
  responseHash: `0x${string}` | null;
  receiptHash: `0x${string}` | null;
};

type TXDetail = {
  state: TXState;
  responseHash: `0x${string}` | null;
  receiptHash: `0x${string}` | null;
};

export const SUPPORTED_SINGLE_TRANSACTIONS = [
  // increase debt
  "APPROVE_WETH",
  "SUPPLY_WETH",
  "BORROW_USDC",

  // decrease debt
  "APPROVE_AWETH",
  "REPAY_USDC",
  "WITHDRAW_WETH",

  // eth/weth
  "UNWRAP_WETH",
  "WRAP_WETH",

  // swaps
  "SWAP_WETH_USDC",
  "SWAP_USDC_WETH",

  "SWAP_WETH_ETH",
  "SWAP_ETH_WETH",

  "SWAP_ETH_USDC",
  "SWAP_USDC_ETH",

  // send tokens
  "SEND_USDC",
  "SEND_WETH",
  "SEND_ETH",
] as const;

export type SupportedSingleTransaction =
  typeof SUPPORTED_SINGLE_TRANSACTIONS[number];

export type SupportedBatchTransaction = "INCREASE_DEBT" | "DECREASE_DEBT";

export const SUPPORTED_BATCH_TRANSACTIONS: Record<
  SupportedBatchTransaction,
  readonly SupportedSingleTransaction[]
> = {
  INCREASE_DEBT: [
    "APPROVE_WETH",
    "SUPPLY_WETH",
    "BORROW_USDC",
  ],
  DECREASE_DEBT: [
    "APPROVE_AWETH",
    "REPAY_USDC",
    "WITHDRAW_WETH",
  ],
} as const;

const SUPPORTED_TRANSACTIONS = [
  ...SUPPORTED_SINGLE_TRANSACTIONS,
  ...Object.keys(SUPPORTED_BATCH_TRANSACTIONS),
] as const;

export type SupportedTransaction =
  | SupportedSingleTransaction
  | SupportedBatchTransaction;

export type TransactionStore = {
  [key in typeof SUPPORTED_TRANSACTIONS[number]]?: TXDetailFull;
};

export type TransactionStoreDerived = {
  [key in typeof SUPPORTED_TRANSACTIONS[number]]?: TXDetail;
};

export function isValidTransactionType(type: string): boolean {
  return SUPPORTED_TRANSACTIONS.includes(type as any);
}

export const txStoreFull = writable<TransactionStore>({});

export const txStore = derived(
  txStoreFull,
  ($txStoreFull) => {
    const derivedTxStore: Record<TXState, TXDetail> = {};

    Object.keys($txStoreFull).forEach((transactionType) => {
      const transactionDetail =
        $txStoreFull[transactionType as SupportedTransaction];

      if (!transactionDetail) {
        return;
      }

      const state: TXStateFull = transactionDetail
        .state as unknown as TXStateFull;

      if (!TX_STATES_FULL.includes(state)) {
        throw new Error(`Invalid transaction state: ${state}`);
      }

      if (TX_STATES.PENDING.includes(state)) {
        derivedTxStore[transactionType] = {
          ...transactionDetail,
          state: "PENDING",
        };
      } else if (TX_STATES.FULFILLED.includes(state)) {
        derivedTxStore[transactionType] = {
          ...transactionDetail,
          state: "FULFILLED",
        };
      } else if (TX_STATES.REJECTED.includes(state)) {
        derivedTxStore[transactionType] = {
          ...transactionDetail,
          state: "REJECTED",
        };
      } else {
        console.error("unhandled transaction state");
        return;
      }
    });

    return derivedTxStore;
  },
);

/// NOTE: we use SupportedSingleTransaction instead of SupportedTransaction
/// because typescript infers the union type as string | string[] instead of
/// the list of consts.

export function setNewTransaction(type: string): void {
  if (!isValidTransactionType(type)) {
    throw new Error(`Invalid transaction type: ${type}`);
  }
  txStoreFull.update((store) => {
    store[type as SupportedTransaction] = {
      responseHash: null,
      state: "STARTED",
      receiptHash: null,
    };
    return { ...store };
  });
}

// Updating txStoreFull
export function updateTransaction(type: string, detail: TXDetailFull): void {
  if (!isValidTransactionType(type)) {
    throw new Error(`Invalid transaction type: ${type}`);
  }
  txStoreFull.update((store) => {
    store[type as SupportedTransaction] = detail;
    return { ...store };
  });
}

// Retrieve a specific transaction from txStoreFull
export function getTransactionFull(type: string): TXDetailFull | undefined {
  if (!isValidTransactionType(type)) {
    throw new Error(`Invalid transaction type: ${type}`);
  }
  let transaction: TXDetailFull | undefined;
  txStoreFull.subscribe(($store) => {
    transaction = $store[type as SupportedTransaction];
  })();
  return transaction;
}

export function getTransaction(type: string): TXDetail | undefined {
  if (!isValidTransactionType(type)) {
    throw new Error(`Invalid transaction type: ${type}`);
  }
  let transaction: TXDetail | undefined;
  txStore.subscribe(($store) => {
    transaction = $store[type as SupportedTransaction];
  })();
  return transaction;
}
