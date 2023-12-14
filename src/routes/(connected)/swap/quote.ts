export type PriceQuote = {
	price: string;
	value: string;
	gasPrice: string;
	gas: string;
	estimatedGas: string;
	protocolFee: string;
	minimumProtocolFee: string;
	buyTokenAddress: string;
	buyAmount: string;
	sellTokenAddress: string;
	sellAmount: string;
	sources: Array<{
		name: string;
		proportion: string;
	}>;
	estimatedGasTokenRefund: string;
	allowanceTarget: string;
	fees: {
		zeroExFee: any;
	};
	grossPrice: string;
	grossBuyAmount: string;
	grossSellAmount: string;
};

export type FinalQuote = {
	chainId: number;
	price: string;
	guaranteedPrice: string;
	estimatedPriceImpact: string;
	to: string;
	data: string;
	value: string;
	gas: string;
	estimatedGas: string;
	gasPrice: string;
	protocolFee: string;
	minimumProtocolFee: string;
	buyTokenAddress: string;
	sellTokenAddress: string;
	buyAmount: string;
	sellAmount: string;
	sources: Array<{
		name: string;
		proportion: string;
	}>;
	orders: Array<{
		makerToken: string;
		takerToken: string;
		makerAmount: string;
		takerAmount: string;
		fillData: {
			tokenAddressPath: Array<string>;
			router: string;
		};
		source: string;
		sourcePathId: string;
		type: number;
	}>;
	allowanceTarget: string;
	sellTokenToEthRate: string;
	buyTokenToEthRate: string;
	fees: {
		zeroExFee: any;
	};
	grossPrice: string;
	grossBuyAmount: string;
	grossSellAmount: string;
};
