import type { BigNumber, BigNumberish, ethers } from "ethers";
import type { EthereumAddress } from "./utils";
import { ChainId } from "@biconomy/core-types";

export const SupportedTokens = ["USDC" , "WETH" , "aWETH"] as const;
export const SupportedContracts = [...SupportedTokens , "POOL" , "ORACLE"] as const;

export type TSupportedTokens = typeof SupportedTokens[number];
export type TSupportedContracts = typeof SupportedContracts[number];

export const ADDRESSES: Record<
  number | ChainId,
  Record<TSupportedContracts, EthereumAddress>
> = {
  [ChainId.POLYGON_MUMBAI]: {
    "USDC": "0x52d800ca262522580cebad275395ca6e7598c014",
    "WETH": "0xc199807AF4fEDB02EE567Ed0FeB814A077de4802",
    "POOL": "0xcC6114B983E4Ed2737E9BD3961c9924e6216c704",
    "aWETH": "0xAba444af64ad33A6d8575b8A353226997d6A126a",
    "ORACLE": "0xc24df0548a5aa08262bff6c2bb48048348e4E097",
  },
};

export type ERC20 = ethers.Contract & {
  balanceOf: (address: EthereumAddress) => Promise<BigNumber>;
  decimals: () => Promise<BigNumberish>;
}

export const BLOCK_EXPLORER_URLS: Record<number | ChainId, string> = {
  [ChainId.POLYGON_MUMBAI]: "https://mumbai.polygonscan.com",
};
