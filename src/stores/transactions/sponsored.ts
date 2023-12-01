import type { BiconomySmartAccount, BiconomySmartAccountV2 } from '@biconomy/account';
import {
	type IHybridPaymaster,
	PaymasterMode,
	type SponsorUserOperationDto,
	type FeeQuotesOrDataDto
} from '@biconomy/paymaster';
import type { PopulatedTransaction, ethers } from 'ethers';
import type { EthereumAddress } from '$lib/utils';
import { updateTransaction, type UUID, type TxStore, increaseTxCounter } from './state';
import { DEFAULT_BLOCK_CONFIRMATIONS } from '$lib/constants';
import { userOpSuccess } from './handler';
import Success from '../../routes/(connected)/loans/transfer/transfer/success.svelte';

export async function sponsoredTx(
	store: TxStore,
	id: UUID,
	addressTo: EthereumAddress,
	data: PopulatedTransaction['data'],
	smartAccount: BiconomySmartAccountV2,
	confirmations: number = DEFAULT_BLOCK_CONFIRMATIONS
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
			mode: PaymasterMode.SPONSORED,
			smartAccountInfo: {
				name: 'BICONOMY',
				version: '2.0.0'
			}
		});
		userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

		const userOpResponse = await smartAccount.sendUserOp(userOp);

		updateTransaction(store, id, {
			userOpReceiptHash: userOpResponse.userOpHash as `0x${string}`,
			state: 'SIGNED',
			sponsored: true
		});

		const { receipt } = await userOpResponse.wait(confirmations);
		const aaSuccess = userOpSuccess(receipt);
		if (!aaSuccess) {
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
	value?: ethers.BigNumberish;
};
export async function batchSponsoredTx(
	store: TxStore,
	id: UUID,
	txs: UserOpTx[],
	smartAccount: BiconomySmartAccountV2,
	confirmations: number = DEFAULT_BLOCK_CONFIRMATIONS
) {
	try {
		const userOp = await smartAccount.buildUserOp(txs);
		const paymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
		const paymasterAndDataResponse = await paymaster.getPaymasterAndData(userOp, {
			mode: PaymasterMode.SPONSORED,
			smartAccountInfo: {
				name: 'BICONOMY',
				version: '2.0.0'
			},
			calculateGasLimits: true
		});

		if (
			paymasterAndDataResponse.callGasLimit &&
			paymasterAndDataResponse.verificationGasLimit &&
			paymasterAndDataResponse.preVerificationGas
		) {
			// Returned gas limits must be replaced in your op as you update paymasterAndData.
			// Because these are the limits paymaster service signed on to generate paymasterAndData
			// If you receive AA34 error check here..
			userOp.callGasLimit = paymasterAndDataResponse.callGasLimit;
			userOp.verificationGasLimit = paymasterAndDataResponse.verificationGasLimit;
			userOp.preVerificationGas = paymasterAndDataResponse.preVerificationGas;
		} else {
			throw new Error('No gas limits were returned');
		}

		const userOpResponse = await smartAccount.sendUserOp(userOp);

		updateTransaction(store, id, {
			state: 'SIGNED',
			userOpReceiptHash: userOpResponse.userOpHash as `0x${string}`,
			sponsored: true
		});

		const { receipt } = await userOpResponse.wait(confirmations);
		const aaSuccess = userOpSuccess(receipt);
		if (!aaSuccess) {
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

export async function batchUserTransaction(
	store: TxStore,
	id: UUID,
	txs: UserOpTx[],
	smartAccount: BiconomySmartAccountV2,
	confirmations: number = DEFAULT_BLOCK_CONFIRMATIONS
) {
	try {
		const userOp = await smartAccount.buildUserOp(txs);
		const userOpResponse = await smartAccount.sendUserOp(userOp);

		updateTransaction(store, id, {
			state: 'SIGNED',
			userOpReceiptHash: userOpResponse.userOpHash as `0x${string}`,
			sponsored: false
		});

		const { receipt } = await userOpResponse.wait(confirmations);
		const aaSuccess = userOpSuccess(receipt);
		if (!aaSuccess) {
			updateTransaction(store, id, {
				state: 'REJECTED',
				finalTxHash: receipt.transactionHash as `0x${string}`
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

export async function batchERC20Tx(
	store: TxStore,
	id: UUID,
	txs: UserOpTx[],
	smartAccount: BiconomySmartAccountV2,
	paymasterToken: EthereumAddress,
	confirmations: number = DEFAULT_BLOCK_CONFIRMATIONS
) {
	try {
		const userOp = await smartAccount.buildUserOp(txs);
		const paymaster = smartAccount.paymaster as IHybridPaymaster<FeeQuotesOrDataDto>;

		const feeQuotesResponse = await paymaster.getPaymasterFeeQuotesOrData(userOp, {
			mode: PaymasterMode.ERC20,
			tokenList: [paymasterToken]
		});

		if (!feeQuotesResponse.feeQuotes || feeQuotesResponse.feeQuotes?.length === 0) {
			throw new Error('No fee quotes were returned');
		}

		const tokenFeeQuote = feeQuotesResponse.feeQuotes[0];

		const finalUserOp = await smartAccount.buildTokenPaymasterUserOp(userOp, {
			feeQuote: tokenFeeQuote,
			spender: feeQuotesResponse.tokenPaymasterAddress as EthereumAddress,
			maxApproval: false
		});

		let paymasterServiceData = {
			mode: PaymasterMode.ERC20,
			smartAccountInfo: {
				name: 'BICONOMY',
				version: '2.0.0'
			},
			feeTokenAddress: tokenFeeQuote.tokenAddress,
			calculateGasLimits: true // Always recommended and especially when using token paymaster
		};
		const paymasterAndDataResponse = await paymaster.getPaymasterAndData(
			finalUserOp,
			paymasterServiceData
		);
		finalUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

		if (
			paymasterAndDataResponse.callGasLimit &&
			paymasterAndDataResponse.verificationGasLimit &&
			paymasterAndDataResponse.preVerificationGas
		) {
			// Returned gas limits must be replaced in your op as you update paymasterAndData.
			// Because these are the limits paymaster service signed on to generate paymasterAndData
			// If you receive AA34 error check here..
			finalUserOp.callGasLimit = paymasterAndDataResponse.callGasLimit;
			finalUserOp.verificationGasLimit = paymasterAndDataResponse.verificationGasLimit;
			finalUserOp.preVerificationGas = paymasterAndDataResponse.preVerificationGas;
		} else {
			throw new Error('No gas limits were returned');
		}

		const userOpResponse = await smartAccount.sendUserOp(finalUserOp);

		updateTransaction(store, id, {
			state: 'SIGNED',
			userOpReceiptHash: userOpResponse.userOpHash as `0x${string}`,
			sponsored: true
		});

		const { receipt } = await userOpResponse.wait(confirmations);
		const aaSuccess = userOpSuccess(receipt);
		if (!aaSuccess) {
			updateTransaction(store, id, {
				state: 'REJECTED',
				finalTxHash: receipt.transactionHash as `0x${string}`
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
