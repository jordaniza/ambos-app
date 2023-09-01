import { ethers, type BigNumberish } from "ethers";

export type EthereumAddress = `0x${string}`;
export const BN = (n: BigNumberish) => ethers.utils.parseEther(n.toString());
export const N = (n: BigNumberish) => ethers.utils.formatEther(n);
