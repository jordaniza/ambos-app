import {
	StargateRouter__factory,
	type StargateRouter,
	StargateRouterETH__factory,
	type StargateRouterETH
} from '$lib/abis/ts';
import type { EthereumAddress } from '$lib/utils';
import { ChainId } from '@biconomy/core-types';
import { createClient, getMessagesBySrcTxHash, type Message } from '@layerzerolabs/scan-client';
import type { BigNumber, ethers } from 'ethers';

export type StargateNetworkConfigs = {
	[chainId in ChainId]?: StargateNetworkConfig;
};

export type StargateNetworkConfig = {
	// different from chainId as L0 compress to uint16
	layerZeroChainId: number;
	router: EthereumAddress;
	routerETH: EthereumAddress;
	poolIds: {
		ETH: number;
	};
};

export const STARGATE_TESTNET_CONFIG: StargateNetworkConfigs = {
	[ChainId.GOERLI]: {
		layerZeroChainId: 10121,
		router: '0x7612aE2a34E5A363E137De748801FB4c86499152',
		routerETH: '0xb1b2eeF380f21747944f46d28f683cD1FBB4d03c',
		poolIds: {
			ETH: 13
		}
	},
	[ChainId.ARBITRUM_GOERLI_TESTNET]: {
		layerZeroChainId: 10143,
		router: '0xb850873f4c993Ac2405A1AdD71F6ca5D4d4d6b4f',
		routerETH: '0xb1b2eeF380f21747944f46d28f683cD1FBB4d03c',
		poolIds: {
			ETH: 13
		}
	},
	[ChainId.OPTIMISM_GOERLI_TESTNET]: {
		layerZeroChainId: 10132,
		router: '0x95461eF0e0ecabC049a5c4a6B98Ca7B335FAF068',
		routerETH: '0xb1b2eeF380f21747944f46d28f683cD1FBB4d03c',
		poolIds: {
			ETH: 13
		}
	}
};

/**
 * StargateRouter wrapper for a single source chain that can then be used to swap to any destination chain
 * We use the router in particular to keep the layer zero chainId as an implementation detail
 * @param chainId the chainId of the source chain, not the layer zero chainId
 * @param provider an ethers provider
 */
export class SourceRouter {
	public router: StargateRouter;
	public routerETH: StargateRouterETH;
	public config: StargateNetworkConfig;
	public signer: ethers.Signer | undefined;

	constructor(readonly chainId: ChainId, readonly provider: ethers.providers.Web3Provider) {
		const sourceConfig = STARGATE_TESTNET_CONFIG[chainId];
		if (!sourceConfig) {
			throw new Error(`Stargate not configured for chainId ${chainId}`);
		}
		this.config = sourceConfig;

		const [router, routerETH] = getStargateRoutersForChain(chainId, provider);
		this.router = router;
		this.routerETH = routerETH;
	}

	public async previewNetworkFeeSwap(
		dstChainId: ChainId,
		toAddress: EthereumAddress
	): Promise<BigNumber> {
		return await previewNetworkFeeSwap(this.router, dstChainId, toAddress);
	}

	public setSigner() {
		this.signer = this.provider.getSigner();
		this.router = this.router.connect(this.signer);
		this.routerETH = this.routerETH.connect(this.signer);
	}

	public async stargateSwapETH(
		dstChainId: ChainId,
		fromAddress: EthereumAddress,
		toAddress: EthereumAddress,
		amount: BigNumber,
		minAmount: BigNumber = amount
	): Promise<ethers.providers.TransactionResponse> {
		if (!this.signer) this.setSigner();
		return await stargateSwapETH(
			this.router,
			this.routerETH,
			dstChainId,
			fromAddress,
			toAddress,
			amount,
			minAmount
		);
	}

	public async stargateSwapStable(
		dstChainId: ChainId,
		token: keyof StargateNetworkConfig['poolIds'],
		fromAddress: EthereumAddress,
		toAddress: EthereumAddress,
		amount: BigNumber,
		minAmount: BigNumber = amount
	): Promise<ethers.providers.TransactionResponse> {
		if (!this.signer) this.setSigner();
		const srcPoolId = this.config.poolIds[token];
		const dstPoolId = STARGATE_TESTNET_CONFIG[dstChainId]?.poolIds[token];
		if (!dstPoolId) {
			throw new Error(`PoolId ${dstPoolId} not configured for destination chainId ${dstChainId}`);
		}

		return await stargateSwapStable(
			this.router,
			dstChainId,
			dstPoolId,
			srcPoolId,
			fromAddress,
			toAddress,
			amount,
			minAmount
		);
	}
}

/**
 * Returns the router for both ETH and stablecoin swaps
 * Use the ETH router for transferring ETH and the router otherwise.
 * Get fees for the ETH swap using the regular router
 * @param chainId the chainId of the source chain, not the layer zero chainId
 * @returns [router, routerETH]
 */
export function getStargateRoutersForChain(
	chainId: ChainId,
	provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
): [StargateRouter, StargateRouterETH] {
	const networkConfig = STARGATE_TESTNET_CONFIG[chainId];
	if (!networkConfig) {
		throw new Error(`Stargate not configured for chainId ${chainId}`);
	}
	return [
		StargateRouter__factory.connect(networkConfig.router, provider),
		StargateRouterETH__factory.connect(networkConfig.routerETH, provider)
	];
}

/**
 * Presets for quoting LayerZero network fees, assuming a simple swap
 * @param router initialized StargateRouter ethers contract
 * @param dstChainId the normal chainId, not the layer zero chainId
 * @param toAddress destination address
 * @returns fee in wei
 */
export async function previewNetworkFeeSwap(
	router: StargateRouter,
	dstChainId: ChainId,
	toAddress: EthereumAddress
): Promise<BigNumber> {
	const destination = STARGATE_TESTNET_CONFIG[dstChainId];
	if (!destination) {
		throw new Error(`Stargate not configured for destination chainId ${dstChainId}`);
	}
	const [feeWei, _] = await router.quoteLayerZeroFee(
		destination.layerZeroChainId, // destination chainId
		1, // function type: see Bridge.sol for all types
		toAddress, // destination of tokens
		'0x', // payload, using abi.encode()
		{
			dstGasForCall: 0, // extra gas, if calling smart contract,
			dstNativeAmount: 0, // amount of dust dropped in destination wallet
			dstNativeAddr: toAddress // destination wallet for dust
		}
	);
	return feeWei;
}

function hasPoolId(config: StargateNetworkConfig, poolId: number): boolean {
	return !!config && Object.values(config.poolIds).includes(poolId);
}

/**
 * @param router initialized StargateRouter ethers contract
 * @param dstChainId the normal chainId, not the layer zero chainId
 * @param address sender/receiver address
 * @param amount tokens to send
 * @param minAmount defaults to amount
 * @returns the ethers transaction response, unawaited
 */
export async function stargateSwapStable(
	router: StargateRouter,
	dstChainId: ChainId,
	dstPoolId: number,
	srcPoolId: number,
	fromAddress: EthereumAddress,
	toAddress: EthereumAddress,
	amount: BigNumber,
	minAmount: BigNumber = amount
): Promise<ethers.providers.TransactionResponse> {
	const destination = STARGATE_TESTNET_CONFIG[dstChainId];
	if (!destination) {
		throw new Error(`Stargate not configured for destination chainId ${dstChainId}`);
	}

	if (!hasPoolId(destination, dstPoolId)) {
		throw new Error(`PoolId ${dstPoolId} not configured for destination chainId ${dstChainId}`);
	}

	const fee = await previewNetworkFeeSwap(router, dstChainId, toAddress);
	return await router.swap(
		destination.layerZeroChainId, // destination chainId
		srcPoolId, // source poolId
		dstPoolId, // destination poolId
		fromAddress, // refund address. extra gas (if any) is returned to this address
		amount, // quantity to swap in LD (local decimals)
		minAmount, // the min qty you would accept in LD (local decimals)
		{ dstGasForCall: 0, dstNativeAmount: 0, dstNativeAddr: '0x' },
		toAddress, // the address to send the tokens to on the destination
		'', // payload
		{ value: fee }
	);
}

/**
 * Executes a crosschain swap from ETH to ETH. Stargate will wrap into WETH and then unwrap on the destination chain.
 * The total value sent will be the amount + the network fee.
 * @param router main router
 * @param routerETH eth wrapper
 * @param dstChainId regular chainId, not the layerZero one
 * @param fromAddress address to send ETH from
 * @param toAddress address to send ETH to
 * @param amount amount of ETH to send
 * @param minAmount min amount of ETH to process without reverting
 * @returns the ethers transaction response, unconfirmed
 */
export async function stargateSwapETH(
	router: StargateRouter,
	routerETH: StargateRouterETH,
	dstChainId: ChainId,
	fromAddress: EthereumAddress,
	toAddress: EthereumAddress,
	amount: BigNumber,
	minAmount: BigNumber = amount
): Promise<ethers.providers.TransactionResponse> {
	const destination = STARGATE_TESTNET_CONFIG[dstChainId];
	if (!destination) {
		throw new Error(`Stargate not configured for destination chainId ${dstChainId}`);
	}
	if (!destination?.poolIds?.ETH) {
		throw new Error(`ETH poolId not configured for destination chainId ${dstChainId}`);
	}
	const fee = await previewNetworkFeeSwap(router, dstChainId, toAddress);
	return await routerETH.swapETHAndCall(
		destination.layerZeroChainId,
		fromAddress,
		toAddress,
		{
			amountLD: amount,
			minAmountLD: minAmount
		},
		{
			dstGasForCall: 0,
			dstNativeAmount: 0,
			dstNativeAddr: '0x'
		},
		'0x',
		{ value: fee.add(amount) }
	);
}

export async function checkLayerZeroMessageStatus(txHash: `0x${string}`): Promise<Message[]> {
	console.warn('layer zero client is hard coded to testnet');
	const client = createClient('testnet');
	const { messages } = await client.getMessagesBySrcTxHash(txHash);
	return messages;
}
