import type { ChainId } from '@biconomy/core-types';
import { ParticleAuthModule, ParticleProvider } from '@biconomy/particle-auth';
import { providers } from 'ethers';
import * as process from '$env/static/public';
import { particleChainNames, particleChains } from './particle-chains';
import { evmWallets, ParticleConnect, type EVMProvider } from '@particle-network/connect';
import { LOCAL_STORAGE_KEYS } from '$lib/constants';
export type ParticleUserInfo = ParticleAuthModule.UserInfo;

export const initConnectKit = (chainId: ChainId): ParticleConnect => {
	const particleProjectId = process.PUBLIC_PARTICLE_PROJECT_ID;
	const clientKey = process.PUBLIC_PARTICLE_CLIENT_KEY;
	const appId = process.PUBLIC_PARTICLE_APP_ID;
	const wcProjectId = process.PUBLIC_WALLETCONNECT_PROJECT_ID;

	if (!particleProjectId || !clientKey || !appId) {
		throw new Error('Missing environment variables for Particle provider');
	}
	const chainName = particleChainNames[chainId];
	if (!chainName) {
		throw new Error('Missing chainName for Particle provider');
	}

	const connectKit = new ParticleConnect({
		projectId: particleProjectId,
		clientKey,
		appId,
		chains: [particleChains[chainId]],
		wallets: evmWallets({
			projectId: wcProjectId
		}),
		securityAccount: {
			// promptMasterPasswordSettingWhenLogin: 2,
			// promptSettingWhenSign: 2
		},
		particleWalletEntry: {
			displayWalletEntry: false,
			uiMode: 'light',
			supportChains: [
				{
					id: chainId,
					name: chainName
				}
			]
		},
		preload: true
	});
	return connectKit;
};

export async function getCachedProvider(
	connectKit: ParticleConnect
): Promise<providers.Web3Provider | undefined> {
	try {
		const cachedProvider = await connectKit.connectToCachedProvider();
		if (cachedProvider) return new providers.Web3Provider(cachedProvider as EVMProvider, 'any');
		else if (connectKit.particle.auth.isLogin()) return getSocialProvider(connectKit);
		else return undefined;
	} catch (error) {
		console.error('Failed to get cached provider:', error);
	}
}

export async function getSocialProvider(
	connectKit: ParticleConnect
): Promise<providers.Web3Provider | undefined> {
	try {
		const particleProvider = new ParticleProvider(
			connectKit.particle.auth as unknown as ParticleAuthModule.Auth
		);

		const provider = new providers.Web3Provider(particleProvider, 'any');
		return provider;
	} catch (error) {
		console.error('Failed to get particle provider:', error);
	}
}

export const signOut = async (connectKit: ParticleConnect): Promise<void> => {
	// all settled doesn't throw an error if one of the promises fails
	// we try both disconnection methods
	await Promise.allSettled([connectKit.disconnect(), connectKit.particle.auth.logout()]);
	// clear the cached provider
	localStorage.removeItem(LOCAL_STORAGE_KEYS.PARTICLE_CACHED_PROVIDER);
};
