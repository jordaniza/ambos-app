import {
  AavePool__factory,
  AaveProtocolDataProvider__factory,
} from "$lib/abis/ts";
import { ADDRESSES } from "$lib/contracts";
import type { EthereumAddress } from "$lib/utils";
import { BigNumber, ethers } from "ethers";
import type { web3Store } from ".";
import { BASE_CURRENCY_DECIMALS, LTV_DECIMALS, RAY_DECIMALS } from "$lib/constants";

export enum InterestRateMode {
  VARIABLE_IR = 2,
  STABLE_IR = 1,
}
export async function getAavePool(provider: ethers.providers.Web3Provider) {
  const { chainId } = await provider.getNetwork();
  const poolAddress = ADDRESSES[chainId]["POOL"];
  if (!poolAddress) {
    throw new Error(`Pool not supported on chain ${chainId}`);
  }
  return poolAddress;
}

export async function getAavePoolDataProvider(
  provider: ethers.providers.Web3Provider,
) {
  const { chainId } = await provider.getNetwork();
  const dataProviderAddress = ADDRESSES[chainId]["POOL_DATA_PROVIDER"];
  if (!dataProviderAddress) {
    throw new Error(`Pool Data Provider not supported on chain ${chainId}`);
  }
  return dataProviderAddress;
}

export async function getPoolUserAccountData(
  userAddress: EthereumAddress,
  provider: ethers.providers.Web3Provider,
) {
  const poolAddress = await getAavePool(provider);
  const pool = AavePool__factory.connect(poolAddress, provider);
  return await pool.getUserAccountData(userAddress);
}

export const getPoolReserveData = async (
  reserveTokenAddress: EthereumAddress,
  provider: ethers.providers.Web3Provider,
) => {
  const poolAddress = await getAavePoolDataProvider(provider);
  const dataProvider = AaveProtocolDataProvider__factory.connect(
    poolAddress,
    provider,
  );
  return await dataProvider.getReserveData(reserveTokenAddress);
};

export const getPoolReserveConfigData = async (
  reserveTokenAddress: EthereumAddress,
  provider: ethers.providers.Web3Provider,
) => {
  const poolAddress = await getAavePoolDataProvider(provider);
  const dataProvider = AaveProtocolDataProvider__factory.connect(
    poolAddress,
    provider,
  );
  return await dataProvider.getReserveConfigurationData(reserveTokenAddress);
};

const getPoolReserveAndConfigData = async (
  reserveTokenAddress: EthereumAddress,
  provider: ethers.providers.Web3Provider,
) => {
  const [reserveData, reserveConfigData] = await Promise.all([
    getPoolReserveData(reserveTokenAddress, provider),
    getPoolReserveConfigData(reserveTokenAddress, provider),
  ]);
  return {
    reserveData,
    reserveConfigData,
  };
};

export type PoolReserveData = Awaited<ReturnType<typeof getPoolReserveData>>;
export type PoolReserveConfigData = Awaited<
  ReturnType<typeof getPoolReserveConfigData>
>;
export type UserAccountData = Awaited<
  ReturnType<typeof getPoolUserAccountData>
>;

export const shouldUpdatePoolData = (
  newVal: Record<string, unknown> | {},
  prevVal: Record<string, unknown> | {},
): boolean => {
  if (!newVal || Object.keys(newVal).length === 0) return false;
  if (!prevVal || Object.keys(prevVal).length === 0) return true;
  return JSON.stringify(newVal) !== JSON.stringify(prevVal);
  0;
};

function setBigSmall(
  num: BigNumber,
  decimals = BASE_CURRENCY_DECIMALS,
) {
  return {
    big: num.toString(),
    small: parseFloat(ethers.utils.formatUnits(num, decimals)),
    decimals,
  };
}

function setPoolDataUser(
  store: typeof web3Store,
  data: UserAccountData,
  blockNumber: number,
) {
  store.update((s) => {
    // If the balance hasn't changed, don't update the store
    const prevUserPoolData = s.userPoolData;
    if (!shouldUpdatePoolData(data, prevUserPoolData)) {
      return s;
    }
    // Update the store
    s.userPoolData = {
      totalCollateralBase: setBigSmall(data.totalCollateralBase, BASE_CURRENCY_DECIMALS),
      totalDebtBase: setBigSmall(data.totalDebtBase, BASE_CURRENCY_DECIMALS),
      availableBorrowBase: setBigSmall(data.availableBorrowsBase, BASE_CURRENCY_DECIMALS),
      currentLiquidationThreshold: setBigSmall(data.currentLiquidationThreshold, LTV_DECIMALS),
      ltv: setBigSmall(data.ltv, LTV_DECIMALS),
      healthFactor: setBigSmall(data.healthFactor, RAY_DECIMALS),
      lastUpdatedBlock: blockNumber,
    };
    return s;
  });
}

function setPoolDataReserve(
  store: typeof web3Store,
  { reserveData, reserveConfigData }: {
    reserveData: PoolReserveData;
    reserveConfigData: PoolReserveConfigData;
  },
  blockNumber: number,
) {
  store.update((s) => {
    // If the balance hasn't changed, don't update the web3Store
    const prevPoolReserveData = s.poolReserveData;

    // construct the new object from both data sources
    const newPoolReserveData = {
      lastUpdatedBlock: blockNumber,
      ltv: setBigSmall(reserveConfigData.ltv, LTV_DECIMALS),
      stableBorrowingEnabled: reserveConfigData.stableBorrowRateEnabled,
      variableBorrowingRate: setBigSmall(
        reserveData.variableBorrowRate,
        RAY_DECIMALS
      ),
      stableBorrowingRate: setBigSmall(
        reserveData.stableBorrowRate,
        RAY_DECIMALS
      ),
    };
    if (!shouldUpdatePoolData(newPoolReserveData, prevPoolReserveData)) {
      return s;
    }

    s.poolReserveData = newPoolReserveData;
    return s;
  });
}

export async function getSetPoolData(
  userAddress: EthereumAddress,
  reserveTokenAddress: EthereumAddress,
  provider: ethers.providers.Web3Provider,
  store: typeof web3Store,
  blockNumber: number,
) {
  try {
    const [userPoolData, poolReserveData] = await Promise.all([
      getPoolUserAccountData(userAddress, provider),
      getPoolReserveAndConfigData(reserveTokenAddress, provider),
    ]);
    setPoolDataUser(store, userPoolData, blockNumber);
    setPoolDataReserve(store, poolReserveData, blockNumber);
  } catch (e) {
    console.error("Error fetching pool data", e);
  }
}

export async function watchPoolData(
  userAddress: EthereumAddress,
  provider: ethers.providers.Web3Provider,
  store: typeof web3Store,
  interval: number,
): Promise<void> {
  const chainId = (await provider.getNetwork()).chainId;
  const reserveTokenAddress = ADDRESSES[chainId]["WETH"];
  const currentBlock = await provider.getBlockNumber();
  await getSetPoolData(
    userAddress,
    reserveTokenAddress,
    provider,
    store,
    currentBlock,
  );
  provider.on("block", async (blockNumber) => {
    if (blockNumber % interval === 0) {
      await getSetPoolData(
        userAddress,
        reserveTokenAddress,
        provider,
        store,
        blockNumber,
      );
    }
  });
}
