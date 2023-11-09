import { type Oracle, Oracle__factory } from '$lib/abis/ts';
import { ADDRESSES } from '$lib/contracts';
import { type BigNumber, ethers } from 'ethers';
import { handleError, type web3Store } from '.';
import type { AppProvider } from '$stores/account';

export async function getOracleWETHPrice(provider: AppProvider) {
	const { chainId } = await provider.getNetwork();
	// debugger;
	console.log('getOracleWETHPrice', { chainId });
	const oracleAddress = ADDRESSES[chainId]['ORACLE'];
	const oracle = Oracle__factory.connect(oracleAddress, provider);
	const [price, decimals] = await Promise.all([oracle.latestAnswer(), oracle.decimals()]);

	return {
		price,
		decimals
	};
}

export const shouldUpdatePrice = (newVal: BigNumber | null, prevVal: string | null): boolean => {
	if (!newVal) return false;
	if (!prevVal) return true;
	return !newVal.eq(prevVal);
};

function setEthPrice(
	store: typeof web3Store,
	price: BigNumber,
	blockNumber: number,
	decimals: number
) {
	store.update((s) => {
		// If the balance hasn't changed, don't update the store
		const prevPrice = s.ethPrice.big;
		if (!shouldUpdatePrice(price, prevPrice)) {
			return s;
		}
		// Update the store
		s.ethPrice.decimals = decimals;
		s.ethPrice.big = price.toString();
		s.ethPrice.small = parseFloat(ethers.utils.formatUnits(price, decimals));
		s.ethPrice.lastUpdatedBlock = blockNumber;
		return s;
	});
}

export async function getSetEthPrice(
	provider: AppProvider,
	store: typeof web3Store,
	blockNumber: number
): Promise<void> {
	try {
		const { price, decimals } = await getOracleWETHPrice(provider);
		setEthPrice(store, price, blockNumber, decimals);
	} catch (e) {
		handleError(store, e as Error, 'getSetEthPrice error');
	}
}

export async function watchEthPrice(
	provider: AppProvider,
	store: typeof web3Store,
	interval: number
): Promise<void> {
	console.log('watchEthPrice', { interval });
	const currentBlock = await provider.getBlockNumber();
	await getSetEthPrice(provider, store, currentBlock);
	provider.on('block', async (blockNumber) => {
		if (blockNumber % interval === 0) {
			await getSetEthPrice(provider, store, blockNumber);
		}
	});
}
