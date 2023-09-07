import type { BiconomySmartAccount } from '@biconomy/account';
import {
	type IHybridPaymaster,
	PaymasterMode,
	type SponsorUserOperationDto
} from '@biconomy/paymaster';
import type { PopulatedTransaction } from 'ethers';
import type { EthereumAddress } from '$lib/utils';
import { updateTransaction, type UUID, type TxStore } from './state';

export async function sponsoredTx(
	store: TxStore,
	id: UUID,
	addressTo: EthereumAddress,
	data: PopulatedTransaction['data'],
	smartAccount: BiconomySmartAccount
) {
	try {
		const userOp = await smartAccount.buildUserOp([
			{
				to: addressTo,
				data
			}
		]);
		const paymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
		const paymasterAndDataResponse = await paymaster.getPaymasterAndData(userOp, {
			mode: PaymasterMode.SPONSORED
		});
		updateTransaction(store, id, {
			finalTxHash: null,
			state: 'SIGNED',
			userOpReceiptHash: null
		});

		userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

		const userOpResponse = await smartAccount.sendUserOp(userOp);

		updateTransaction(store, id, {
			finalTxHash: userOpResponse.userOpHash as `0x${string}`,
			state: 'CONFIRMED',
			userOpReceiptHash: null
		});

		const { receipt } = await userOpResponse.wait(1);
		if (receipt.status === 0) {
			updateTransaction(store, id, {
				finalTxHash: userOpResponse.userOpHash as `0x${string}`,
				state: 'REJECTED',
				userOpReceiptHash: null
			});
		} else {
			updateTransaction(store, id, {
				finalTxHash: userOpResponse.userOpHash as `0x${string}`,
				state: 'SUCCESSFUL',
				userOpReceiptHash: receipt.transactionHash as `0x${string}`
			});
		}
	} catch (err: any) {
		console.error(err);
		updateTransaction(store, id, {
			finalTxHash: null,
			state: 'FAILED',
			userOpReceiptHash: null
		});
	}
}

export type UserOpTx = {
	to: EthereumAddress;
	data: PopulatedTransaction['data'];
};
export async function batchSponsoredTx(
	store: TxStore,
	id: UUID,
	txs: UserOpTx[],
	smartAccount: BiconomySmartAccount
) {
	try {
		const userOp = await smartAccount.buildUserOp(txs);
		console.log(userOp);
		const paymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
		const paymasterAndDataResponse = await paymaster.getPaymasterAndData(userOp, {
			mode: PaymasterMode.SPONSORED
		});
		updateTransaction(store, id, {
			state: 'SIGNED'
		});

		userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
		const userOpResponse = await smartAccount.sendUserOp(userOp);

		updateTransaction(store, id, {
			state: 'CONFIRMED',
			userOpReceiptHash: userOpResponse.userOpHash as `0x${string}`
		});

		const { receipt } = await userOpResponse.wait(1);
		if (receipt.status === 0) {
			updateTransaction(store, id, {
				state: 'REJECTED'
			});
		} else {
			updateTransaction(store, id, {
				state: 'SUCCESSFUL',
				finalTxHash: receipt.transactionHash as `0x${string}`
			});
		}
	} catch (err: any) {
		updateTransaction(store, id, {
			finalTxHash: null,
			error: err.message ?? err,
			state: 'FAILED',
			userOpReceiptHash: null
		});
		console.error(err);
	}
}
