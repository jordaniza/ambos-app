import type { ChainId } from '@biconomy/core-types';
import { ParticleAuthModule, ParticleProvider } from '@biconomy/particle-auth';
import { providers } from 'ethers';
import * as process from '$env/static/public';
import { particleChainNames } from './particleChainNames';
import { evmWallets, ParticleConnect } from '@particle-network/connect';
import type { ParticleNetwork } from '@particle-network/auth';
import { PolygonMumbai } from '@particle-network/chains';
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
		chains: [PolygonMumbai],
		wallets: evmWallets({
			projectId: wcProjectId
		}),
		particleWalletEntry: {
			displayWalletEntry: false
		},
		preload: true
	});
	// console.log('connectKit', connectKit);
	return connectKit;
};

export const initParticle = (chainId: ChainId): ParticleNetwork => {
	const connectKit = initConnectKit(chainId);
	return connectKit.particle;

	// console.warn('Auth is configured to use the Polygon chain');
	// const auth = new ParticleAuthModule.ParticleNetwork({
	// 	projectId: particleProjectId,
	// 	clientKey,
	// 	appId,
	// 	chainId,
	// 	chainName,
	// 	wallet: {
	// 		displayWalletEntry: false,
	// 		uiMode: 'light',
	// 		supportChains: [
	// 			{
	// 				id: chainId,
	// 				name: 'Polygon'
	// 			}
	// 		]
	// 	}
	// });

	// console.log('auth', auth);
	// return auth;
};

export const getProvider = (particle: ParticleNetwork): providers.Web3Provider | undefined => {
	try {
		const particleProvider = new ParticleProvider(
			particle.auth as unknown as ParticleAuthModule.Auth
		);
		const w3Provider = new providers.Web3Provider(particleProvider, 'any');
		return w3Provider;
	} catch (error) {
		console.error('AMBOS:', error);
	}
};

export const signOut = async (particle: ParticleNetwork): Promise<void> => {
	try {
		await particle.auth.logout();
	} catch (error) {
		console.error('Problem with Logout', error);
	}
};

export const getUserInfo = async (
	particle: ParticleNetwork
): Promise<ParticleUserInfo | null | undefined> => {
	try {
		let userInfo;
		if (!particle.auth.isLogin()) {
			userInfo = await particle.auth.login();
		} else {
			particle.auth.getUserInfo();
		}
		return userInfo;
	} catch (error) {
		console.error('Problem with getUserInfo', error);
	}
};

export const signIn = async (
	particle: ParticleNetwork
): Promise<ParticleUserInfo | null | undefined> => {
	try {
		const userInfo = await particle.auth.login();
		return userInfo;
	} catch (error) {
		console.error('Problem with Login', error);
	}
};
