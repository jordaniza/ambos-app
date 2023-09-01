
import { Bundler, type IBundler } from "@biconomy/bundler";
import {
  BiconomySmartAccount,
  type BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import type { ChainId } from "@biconomy/core-types";
import { BiconomyPaymaster, type IPaymaster } from "@biconomy/paymaster";
import type { ethers } from "ethers";
import * as process from '$env/static/public';

export const getBundler = (
  chainId: ChainId,
  entryPointAddress = DEFAULT_ENTRYPOINT_ADDRESS,
): IBundler => {
  const bundlerApiKey = process.PUBLIC_BICONOMY_BUNDLER_API_KEY
  if (!bundlerApiKey) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_BICONOMY_BUNDLER_API_KEY");
  }

  return new Bundler({
    bundlerUrl:
      `https://bundler.biconomy.io/api/v2/${chainId}/${bundlerApiKey}`, // bundler URL from dashboard use 84531 as chain id if you are following this on base goerli,
    chainId,
    entryPointAddress,
  });
};

export const getPaymaster = (chainId: ChainId): IPaymaster => {
  const paymasterApiKey = process.PUBLIC_BICONOMY_PAYMASTER_API_KEY;
  if (!paymasterApiKey) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY");
  }
  return new BiconomyPaymaster({
    paymasterUrl:
      `https://paymaster.biconomy.io/api/v1/${chainId}/${paymasterApiKey}`, // paymaster url from dashboard
  });
};

type GetSmartAccountProps = {
  chainId: ChainId;
  provider: ethers.providers.Web3Provider;
  bundler: IBundler;
  paymaster: IPaymaster;
};

export const getSmartAccount = async (
  { chainId, provider, bundler, paymaster }: GetSmartAccountProps,
) => {
  const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
    signer: provider.getSigner(),
    chainId,
    bundler,
    paymaster,
  };
  const biconomySmartAccount = new BiconomySmartAccount(
    biconomySmartAccountConfig,
  );
  return await biconomySmartAccount.init();
};
