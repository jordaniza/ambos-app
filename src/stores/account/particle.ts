import type { ChainId } from '@biconomy/core-types';
import { ParticleAuthModule, ParticleProvider } from '@biconomy/particle-auth';
import { providers } from 'ethers';
import * as process from '$env/static/public';
import { particleChainNames } from './particleChainNames';
import { evmWallets, ParticleConnect, type EVMProvider } from '@particle-network/connect';
import type { ParticleNetwork } from '@particle-network/auth';
import { PolygonMumbai } from '@particle-network/chains';
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

	console.warn('Auth is configured to use the Polygon chain');

	const connectKit = new ParticleConnect({
		projectId: particleProjectId,
		clientKey,
		appId,
		chains: [PolygonMumbai],
		wallets: evmWallets({
			projectId: wcProjectId
		}),
		particleWalletEntry: {
			displayWalletEntry: false
		},
		preload: true
	});
	return connectKit;
};

export async function getCachedProvider(
	connectKit: ParticleConnect
): Promise<providers.Web3Provider | undefined> {
	const cachedProvider = await connectKit.connectToCachedProvider();
	if (!cachedProvider) return;
	return new providers.Web3Provider(cachedProvider as EVMProvider, 'any');
}

export async function getSocialProvider(
	connectKit: ParticleConnect
): Promise<providers.Web3Provider | undefined> {
	try {
		const particleProvider = new ParticleProvider(
			connectKit.particle.auth as unknown as ParticleAuthModule.Auth
		);
		return new providers.Web3Provider(particleProvider, 'any');
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
