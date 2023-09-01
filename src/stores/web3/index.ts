import { SupportedTokens, type TSupportedTokens } from "$lib/contracts";
import { writable } from "svelte/store";

type TokenBalance = {
  big: string | null;
  small: number | null;
  decimals: number | null;
  lastUpdatedBlock: number | null;
};

type EthPrice = {
  big: string | null;
  small: number | null;
  // aave oracle sometimes returns 27 decimals
  decimals: number | null;
  lastUpdatedBlock: number | null;
};

type StoreTokenBalances = {
  [T in TSupportedTokens]: TokenBalance;
};

export type Web3Store = {
  balances: StoreTokenBalances;
  ethPrice: EthPrice;
};

const DEFAULT_STORE: Web3Store = {
  ethPrice: {
    big: null,
    small: null,
    decimals: null,
    lastUpdatedBlock: null,
  },
  balances: SupportedTokens.reduce((acc, token) => {
    acc[token] = {
      big: null,
      small: null,
      decimals: null,
      lastUpdatedBlock: null,
    };
    return acc;
  }, {} as StoreTokenBalances),
};

export const web3Store = writable(DEFAULT_STORE);
