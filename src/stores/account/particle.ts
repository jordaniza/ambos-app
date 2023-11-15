import type { ChainId } from '@biconomy/core-types';
import { ParticleAuthModule, ParticleProvider } from '@biconomy/particle-auth';
import { providers } from 'ethers';
import * as process from '$env/static/public';
import { particleChainNames } from './particleChainNames';
export type ParticleUserInfo = ParticleAuthModule.UserInfo;

export const initParticle = (chainId: ChainId) => {
	const projectId = process.PUBLIC_PARTICLE_PROJECT_ID;
	const clientKey = process.PUBLIC_PARTICLE_CLIENT_KEY;
	const appId = process.PUBLIC_PARTICLE_APP_ID;

	if (!projectId || !clientKey || !appId) {
		throw new Error('Missing environment variables for Particle provider');
	}
	const chainName = particleChainNames[chainId];
	if (!chainName) {
		throw new Error('Missing chainName for Particle provider');
	}

	// console.warn('Auth is configured to use the Polygon chain');
	return new ParticleAuthModule.ParticleNetwork({
		projectId,
		clientKey,
		appId,
		chainId,
		chainName,
		wallet: {
			displayWalletEntry: false,
			uiMode: 'light',
			supportChains: [
				{
					id: chainId,
					name: chainName
				}
			]
		}
	});
};

export const getProvider = (
	particle: ParticleAuthModule.ParticleNetwork
): providers.Web3Provider | undefined => {
	try {
		const particleProvider = new ParticleProvider(particle.auth);
		const w3Provider = new providers.Web3Provider(particleProvider, 'any');
		return w3Provider;
	} catch (error) {
		console.error(error);
	}
};

export const signOut = async (particle: ParticleAuthModule.ParticleNetwork): Promise<void> => {
	try {
		await particle.auth.logout();
	} catch (error) {
		console.error('Problem with Logout', error);
	}
};

export const getUserInfo = async (
	particle: ParticleAuthModule.ParticleNetwork
): Promise<ParticleUserInfo | null | undefined> => {
	try {
		let userInfo;
		if (!particle.auth.isLogin()) {
			userInfo = await particle.auth.login();
		} else {
			userInfo = particle.auth.userInfo();
		}
		return userInfo;
	} catch (error) {
		console.error('Problem with getUserInfo', error);
	}
};

export const signIn = async (
	particle: ParticleAuthModule.ParticleNetwork
): Promise<ParticleUserInfo | null | undefined> => {
	try {
		const userInfo = await particle.auth.login();
		return userInfo;
	} catch (error) {
		console.error('Problem with Login', error);
	}
};
