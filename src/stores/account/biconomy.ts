import { Bundler, type IBundler } from '@biconomy/bundler';
import {
	DEFAULT_ENTRYPOINT_ADDRESS,
	BiconomySmartAccountV2,
	type BiconomySmartAccountV2Config
} from '@biconomy/account';
import type { ChainId } from '@biconomy/core-types';
import { BiconomyPaymaster, type IPaymaster } from '@biconomy/paymaster';
import type { ethers } from 'ethers';
import * as process from '$env/static/public';
import { DEFAULT_ECDSA_OWNERSHIP_MODULE, ECDSAOwnershipValidationModule } from '@biconomy/modules';

export const getBundler = (
	chainId: ChainId,
	entryPointAddress = DEFAULT_ENTRYPOINT_ADDRESS
): IBundler => {
	const bundlerApiKey = process.PUBLIC_BICONOMY_BUNDLER_API_KEY;
	if (!bundlerApiKey) {
		throw new Error('Missing environment variable: PUBLIC_BICONOMY_BUNDLER_API_KEY');
	}

	return new Bundler({
		bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId}/${bundlerApiKey}`, // bundler URL from dashboard use 84531 as chain id if you are following this on base goerli,
		chainId,
		entryPointAddress
	});
};

export const getPaymaster = (chainId: ChainId): IPaymaster => {
	const paymasterApiKey = process.PUBLIC_BICONOMY_PAYMASTER_API_KEY;
	if (!paymasterApiKey) {
		throw new Error('Missing environment variable: PUBLIC_BICONOMY_PAYMASTER_API_KEY');
	}
	return new BiconomyPaymaster({
		paymasterUrl: `https://paymaster.biconomy.io/api/v1/${chainId}/${paymasterApiKey}` // paymaster url from dashboard
	});
};

type GetSmartAccountProps = {
	chainId: ChainId;
	provider: ethers.providers.Web3Provider;
};

export const getSmartAccount = async ({ chainId, provider }: GetSmartAccountProps) => {
	try {
		const module = await ECDSAOwnershipValidationModule.create({
			signer: provider.getSigner(), // you will need to supply a signer from an EOA in this step
			moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
		});

		const bundler = getBundler(chainId);
		const paymaster = getPaymaster(chainId);
		const biconomySmartAccountConfig: BiconomySmartAccountV2Config = {
			chainId,
			bundler,
			paymaster,
			entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
			defaultValidationModule: module,
			activeValidationModule: module
		};
		const biconomySmartAccount = await BiconomySmartAccountV2.create(biconomySmartAccountConfig);
		return biconomySmartAccount;
	} catch (error) {
		console.error('Error Fetching The Biconomy Smart Account:', error);
	}
};
