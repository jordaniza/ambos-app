import { ChainId } from "@biconomy/core-types";
const SupportedTokens = ["USDC", "WETH", "aWETH"];
({
  [ChainId.POLYGON_MUMBAI]: {
    "USDC": "0x52d800ca262522580cebad275395ca6e7598c014",
    "WETH": "0xc199807AF4fEDB02EE567Ed0FeB814A077de4802",
    "POOL": "0xcC6114B983E4Ed2737E9BD3961c9924e6216c704",
    "aWETH": "0xAba444af64ad33A6d8575b8A353226997d6A126a",
    "ORACLE": "0xc24df0548a5aa08262bff6c2bb48048348e4E097",
    "POOL_DATA_PROVIDER": "0x9e2DDb6aA91399546Bd875E2e63E8d6df276922e"
  }
});
const BLOCK_EXPLORER_URLS = {
  [ChainId.POLYGON_MUMBAI]: "https://mumbai.polygonscan.com"
};
export {
  BLOCK_EXPLORER_URLS as B,
  SupportedTokens as S
};
