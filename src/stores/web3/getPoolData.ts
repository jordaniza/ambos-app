import { ADDRESSES } from "$lib/contracts";
import type { ethers } from "ethers";

export enum InterestRateMode {
  VARIABLE_IR = 2,
  STABLE_IR = 1,
}
export const getAavePool = async (provider: ethers.providers.Web3Provider) => {
  const { chainId } = await provider.getNetwork();
  const poolAddress = ADDRESSES[chainId]["POOL"];
  if (!poolAddress) {
    throw new Error(`Pool not supported on chain ${chainId}`);
  }
  return poolAddress;
};

