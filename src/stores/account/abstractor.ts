// export the 3rd party SDKs behind a common interface
import type { ethers, providers } from 'ethers';
import * as biconomy from './biconomy';
import * as particle from './particle';
import type { IBundler } from '@biconomy/bundler';
import type { IPaymaster } from '@biconomy/paymaster';
import type { BiconomySmartAccount, BiconomySmartAccountV2 } from '@biconomy/account';
import type { ParticleAuthModule } from '@biconomy/particle-auth';
import type { AppProvider } from '.';

export interface AccountAbstractor<
	Provider = providers.Web3Provider,
	Bundler = any,
	Paymaster = any,
	SCW = any,
	User = any
> {
	getProvider(network: string): Provider;
	getBundler(): Bundler;
	getPaymaster(): Paymaster;
	getSCW(provider: ethers.providers.Web3Provider): Promise<SCW>;
	getUser(): Promise<User>;
	signOut(): Promise<void>;
}

export class BiconomyAccountAbstractor
	implements
		AccountAbstractor<
			providers.Web3Provider | undefined,
			IBundler,
			IPaymaster,
			BiconomySmartAccountV2 | undefined,
			particle.ParticleUserInfo | null | undefined
		>
{
	public chainId: number;
	constructor(chainId: number) {
		this.chainId = chainId;
	}

	private _getAuth(): ParticleAuthModule.ParticleNetwork {
		return particle.initParticle(this.chainId);
	}

	public getProvider(): providers.Web3Provider | undefined {
		try {
			return particle.getProvider(this._getAuth());
		} catch (error) {
			console.error('Error Fetching The Biconomy Smart Account:', error);
		}
	}

	public getBundler() {
		return biconomy.getBundler(this.chainId);
	}

	public getPaymaster() {
		return biconomy.getPaymaster(this.chainId);
	}

	public async getUser(): Promise<particle.ParticleUserInfo | null | undefined> {
		try {
			return particle.getUserInfo(this._getAuth());
		} catch (error) {
			console.error('Error Fetching The Biconomy Smart Account:', error);
		}
	}

	public async getSCW(
		provider: ethers.providers.Web3Provider
	): Promise<BiconomySmartAccountV2 | undefined> {
		try {
			if (!provider) throw new Error('Provider is not initialized');
			// this will sign the user in and return the user info
			const bundler = this.getBundler();
			const paymaster = this.getPaymaster();
			const smartAccount = await biconomy.getSmartAccount({
				chainId: this.chainId,
				provider,
				bundler,
				paymaster
			});
			if (!smartAccount) throw new Error('Smart Account is not initialized');
			return smartAccount;
		} catch (error) {
			console.error('Error Fetching The Biconomy Smart Account:', error);
		}
	}

	public async signOut(): Promise<void> {
		try {
			await particle.signOut(this._getAuth());
		} catch (error) {
			console.error('Problem with Logout', error);
		}
	}
}
