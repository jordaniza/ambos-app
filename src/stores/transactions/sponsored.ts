import type { BiconomySmartAccount } from '@biconomy/account';
import {
	type IHybridPaymaster,
	PaymasterMode,
	type SponsorUserOperationDto
} from '@biconomy/paymaster';
import type { PopulatedTransaction } from 'ethers';
import type { EthereumAddress } from '$lib/utils';
import { updateTransaction, type UUID, type TxStore, increaseTxCounter } from './state';

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
		userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

		const userOpResponse = await smartAccount.sendUserOp(userOp);

		updateTransaction(store, id, {
			userOpReceiptHash: userOpResponse.userOpHash as `0x${string}`,
			state: 'SIGNED',
			sponsored: true
		});

		const { receipt } = await userOpResponse.wait(1);
		if (receipt.status === 0) {
			updateTransaction(store, id, {
				finalTxHash: receipt.transactionHash as `0x${string}`,
				state: 'REJECTED'
			});
		} else {
			increaseTxCounter(store);
			updateTransaction(store, id, {
				finalTxHash: receipt.transactionHash as `0x${string}`,
				state: 'SUCCESSFUL'
			});
		}
	} catch (err: any) {
		console.error(err);
		updateTransaction(store, id, {
			error: err.message ?? err,
			state: 'FAILED'
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
		const paymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
		const paymasterAndDataResponse = await paymaster.getPaymasterAndData(userOp, {
			mode: PaymasterMode.SPONSORED
		});

		userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
		const userOpResponse = await smartAccount.sendUserOp(userOp);

		updateTransaction(store, id, {
			state: 'SIGNED',
			userOpReceiptHash: userOpResponse.userOpHash as `0x${string}`,
			sponsored: true
		});

		const { receipt } = await userOpResponse.wait(1);
		if (receipt.status === 0) {
			updateTransaction(store, id, {
				state: 'REJECTED'
			});
		} else {
			increaseTxCounter(store);
			updateTransaction(store, id, {
				state: 'SUCCESSFUL',
				finalTxHash: receipt.transactionHash as `0x${string}`
			});
		}
	} catch (err: any) {
		updateTransaction(store, id, {
			error: err.message ?? err,
			state: 'FAILED'
		});
		console.error(err);
	}
}
