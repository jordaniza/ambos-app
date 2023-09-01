import { AavePool__factory, WETH__factory } from "$lib/abis/ts";
import type { EthereumAddress } from "$lib/utils";
import { getTokenAddress } from "$stores/web3/getBalances";
import type { BiconomySmartAccount } from "@biconomy/account";
import type { BigNumber, ethers } from "ethers";
import { setNewTransaction, updateTransaction } from "./state";
import { sponsoredTx } from "./sponsored";
import { getAavePool, InterestRateMode } from "$stores/web3/getPoolData";

export async function approveWethSmartAccount(
  addressToApprove: EthereumAddress,
  amount: BigNumber,
  provider: ethers.providers.Web3Provider,
  smartAccount: BiconomySmartAccount,
) {
  const transactionType = "APPROVE_WETH";
  setNewTransaction(transactionType);

  const wethAddress = await getTokenAddress(provider, "WETH");
  const weth = WETH__factory.connect(wethAddress, provider);
  const approveTx = await weth.populateTransaction.approve(
    addressToApprove,
    amount,
  );
  updateTransaction(transactionType, {
    responseHash: null,
    state: "SIGNING",
    receiptHash: null,
  });

  await sponsoredTx(
    wethAddress,
    approveTx.data,
    smartAccount,
    transactionType,
  );
}

export async function sendWethSmartAccount(
  addressTo: EthereumAddress,
  amount: BigNumber,
  provider: ethers.providers.Web3Provider,
  smartAccount: BiconomySmartAccount,
) {
  const transactionType = "SEND_WETH";
  setNewTransaction(transactionType);

  const wethAddress = await getTokenAddress(provider, "WETH");
  const weth = WETH__factory.connect(wethAddress, provider);
  const transferTx = await weth.populateTransaction.transfer(
    addressTo,
    amount,
  );

   updateTransaction(transactionType, {
    responseHash: null,
    state: "SIGNING",
    receiptHash: null,
  });
 
  await sponsoredTx(
    wethAddress,
    transferTx.data,
    smartAccount,
    "SEND_WETH",
  );
}

export async function supplyWethToAavePool(
  amount: ethers.BigNumber,
  onBehalfOf: EthereumAddress,
  provider: ethers.providers.Web3Provider,
  smartAccount: BiconomySmartAccount,
) {
  const transactionType = "SUPPLY_WETH";
  setNewTransaction(transactionType);

  const poolAddress = await getAavePool(provider);
  const pool = AavePool__factory.connect(poolAddress, provider);
  const wethAddress = await getTokenAddress(provider, "WETH");
  const tx = await pool.populateTransaction.supply(
    wethAddress,
    amount,
    onBehalfOf,
    0,
  );

  updateTransaction(transactionType, {
    responseHash: null,
    state: "SIGNING",
    receiptHash: null,
  });


  await sponsoredTx(
    poolAddress,
    tx.data,
    smartAccount,
    "SUPPLY_WETH",
  );
}

export async function borrowUsdcFromAavePool(
  amount: ethers.BigNumber,
  borrower: EthereumAddress,
  provider: ethers.providers.Web3Provider,
  smartAccount: BiconomySmartAccount,
  interestRateMode: InterestRateMode,
) {
  
  const transactionType = "BORROW_USDC";
  setNewTransaction(transactionType);

  const poolAddress = await getAavePool(provider);
  const pool = AavePool__factory.connect(poolAddress, provider);
  const usdcAddress = await getTokenAddress(provider, "USDC");
  const tx = await pool.populateTransaction.borrow(
    usdcAddress,
    amount,
    interestRateMode,
    0,
    borrower,
  );

  updateTransaction(transactionType, {
    responseHash: null,
    state: "SIGNING",
    receiptHash: null,
  });

  await sponsoredTx(
    poolAddress,
    tx.data,
    smartAccount,
    "BORROW_USDC",
  );
}
