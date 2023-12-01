/// With account abstraction, it's possible for a successful transaction to be reverted
/// in a try/catch block. For now, we want to ensure the RPC checks for the revert string before determining success

import { Entrypoint__factory } from '$lib/abis/ts';
import { DEFAULT_ENTRYPOINT_ADDRESS } from '@biconomy/modules';
import type { ethers } from 'ethers';

export function userOpSuccess(receipt: ethers.providers.TransactionReceipt): boolean {
	const logs = receipt.logs;
	const epAddr = DEFAULT_ENTRYPOINT_ADDRESS;
	const entrypointIface = Entrypoint__factory.createInterface();

	// filter to just the logs in the entrypoint contract
	const entrypointLogs = logs
		.filter((log) => log.address.toLowerCase() === epAddr.toLowerCase())
		.map((log) => entrypointIface.parseLog(log));

	// find the UserOperationEvent and check the success flag
	const userOperationEvent = entrypointLogs.find((event) => event.name === 'UserOperationEvent');
	return userOperationEvent?.args?.success ?? false;
}
