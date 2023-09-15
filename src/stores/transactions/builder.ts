import type { BiconomySmartAccount } from '@biconomy/account';
import {
	type IHybridPaymaster,
	PaymasterMode,
	type SponsorUserOperationDto
} from '@biconomy/paymaster';
import type { PopulatedTransaction, ethers } from 'ethers';
import type { EthereumAddress } from '$lib/utils';
import {
	updateTransaction,
	type UUID,
	type TxStore,
	increaseTxCounter,
	type SupportedSingleTransaction,
	setNewTransaction
} from './state';

/**
 * Basic handler for sponsored transactions
 * @param store pass in the current instance of the svelte store
 * @param transactionType must be a registered/supported action
 * @param provider the web3 provider
 * @param smartAccount the smart account instance required for sponsorship
 * @param transactionBuilder callback to contain the logic for building the transaction
 */
export async function handleSponsoredTransaction(
	store: TxStore,
	transactionType: SupportedSingleTransaction,
	provider: ethers.providers.Web3Provider,
	smartAccount: BiconomySmartAccount,
	transactionBuilder: (
		provider: ethers.providers.Web3Provider,
		id: UUID
	) => Promise<{ contractAddress: EthereumAddress; data: any }>
): Promise<void> {
	const id = setNewTransaction(store, transactionType);
	const { contractAddress, data } = await transactionBuilder(provider, id);
	updateTransaction(store, id, {
		state: 'SIGNING'
	});
	await sponsoredTx(store, id, contractAddress, data, smartAccount);
}

/**
 * Basic handler for user paid transactions, requires a signer.
 * @param store pass in the current instance of the svelte store
 * @param transactionType must be a registered/supported action
 * @param provider the ethers signer
 * @param transactionBuilder executed transaction call
 */
export async function handleUserPaidTransaction(
	store: TxStore,
	transactionType: SupportedSingleTransaction,
	signer: ethers.Signer,
	transactionBuilder: (
		signer: ethers.Signer,
		id: UUID
	) => Promise<{ tx: ethers.providers.TransactionResponse }>
): Promise<void> {
	const id = setNewTransaction(store, transactionType);
	const { tx } = await transactionBuilder(signer, id);
	try {
		updateTransaction(store, id, {
			txReceiptHash: tx.hash as `0x${string}`,
			state: 'SIGNED'
		});

		const receipt = await tx.wait(1);
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
