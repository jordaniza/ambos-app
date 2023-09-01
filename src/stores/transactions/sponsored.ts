import type { getToastStore } from "@skeletonlabs/skeleton";
import type { BiconomySmartAccount } from "@biconomy/account";
import {
  type IHybridPaymaster,
  PaymasterMode,
  type SponsorUserOperationDto,
} from "@biconomy/paymaster";
import type { PopulatedTransaction } from "ethers";
import type { EthereumAddress } from "$lib/utils";
import {
  type SupportedBatchTransaction,
  type SupportedSingleTransaction,
  updateTransaction,
} from "./state";

export async function sponsoredTx(
  addressTo: EthereumAddress,
  data: PopulatedTransaction["data"],
  smartAccount: BiconomySmartAccount,
  transactionType: SupportedSingleTransaction,
) {
  try {
    const userOp = await smartAccount.buildUserOp([
      {
        to: addressTo,
        data,
      },
    ]);
    const paymaster = smartAccount.paymaster as IHybridPaymaster<
      SponsorUserOperationDto
    >;
    const paymasterAndDataResponse = await paymaster
      .getPaymasterAndData(
        userOp,
        {
          mode: PaymasterMode.SPONSORED,
        },
      );
    updateTransaction(transactionType, {
      responseHash: null,
      state: "SIGNED",
      receiptHash: null,
    });

    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

    const userOpResponse = await smartAccount.sendUserOp(userOp);

    updateTransaction(transactionType, {
      responseHash: userOpResponse.userOpHash as `0x${string}`,
      state: "CONFIRMED",
      receiptHash: null,
    });

    const { receipt } = await userOpResponse.wait(1);
    if (receipt.status === 0) {
      updateTransaction(transactionType, {
        responseHash: userOpResponse.userOpHash as `0x${string}`,
        state: "REJECTED",
        receiptHash: null,
      });
    } else {
      updateTransaction(transactionType, {
        responseHash: userOpResponse.userOpHash as `0x${string}`,
        state: "SUCCESSFUL",
        receiptHash: receipt.transactionHash as `0x${string}`,
      });
    }
  } catch (err: any) {
    console.error(err);
    updateTransaction(transactionType, {
      responseHash: null,
      state: "FAILED",
      receiptHash: null,
    });
  }
}

export type UserOpTx = {
  to: EthereumAddress;
  data: PopulatedTransaction["data"];
};
export async function batchSponsoredTx(
  txs: UserOpTx[],
  smartAccount: BiconomySmartAccount,
  transactionType: SupportedBatchTransaction,
) {
  try {
    const userOp = await smartAccount.buildUserOp(txs);
    console.log(userOp);
    const paymaster = smartAccount.paymaster as IHybridPaymaster<
      SponsorUserOperationDto
    >;
    const paymasterAndDataResponse = await paymaster
      .getPaymasterAndData(
        userOp,
        {
          mode: PaymasterMode.SPONSORED,
        },
      );
    updateTransaction(transactionType, {
      responseHash: null,
      state: "SIGNED",
      receiptHash: null,
    });

    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
    const userOpResponse = await smartAccount.sendUserOp(userOp);

    updateTransaction(transactionType, {
      responseHash: userOpResponse.userOpHash as `0x${string}`,
      state: "CONFIRMED",
      receiptHash: null,
    });

    const { receipt } = await userOpResponse.wait(1);
    if (receipt.status === 0) {
      updateTransaction(transactionType, {
        responseHash: userOpResponse.userOpHash as `0x${string}`,
        state: "REJECTED",
        receiptHash: null,
      });
    } else {
      updateTransaction(transactionType, {
        responseHash: userOpResponse.userOpHash as `0x${string}`,
        state: "SUCCESSFUL",
        receiptHash: receipt.transactionHash as `0x${string}`,
      });
    }
  } catch (err: any) {
    updateTransaction(transactionType, {
      responseHash: null,
      state: "FAILED",
      receiptHash: null,
    });
    console.error(err);
  }
}


