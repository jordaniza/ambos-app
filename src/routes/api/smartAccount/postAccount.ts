import { API_ROUTES, LOCAL_STORAGE_KEYS } from '$lib/constants';
import type { EthereumAddress } from '$lib/utils';

async function logEthereumAddresses(
	signerAddress: EthereumAddress,
	smartAccountAddress: EthereumAddress
): Promise<boolean> {
	try {
		const response = await fetch(API_ROUTES.POST.SMART_ACCOUNT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ signerAddress, smartAccountAddress })
		});

		if (!response.ok) {
			// Handle response errors
			console.error('Server error:', response.statusText);
			return false;
		}

		return true;
	} catch (error) {
		// Handle network errors
		console.error('Network error:', error);
		return false;
	}
}

export async function logIfNotInLocalStorage(
	signerAddress: EthereumAddress,
	smartAccountAddress: EthereumAddress
) {
	const localStorageKey = LOCAL_STORAGE_KEYS.LOG_ETHEREUM_ADDRESS;
	const localStorageValue = localStorage.getItem(localStorageKey);
	if (localStorageValue === null) {
		const success = await logEthereumAddresses(signerAddress, smartAccountAddress);
		if (success) localStorage.setItem(localStorageKey, 'true');
	}
}
