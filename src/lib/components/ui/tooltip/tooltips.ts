import { MAX_BORROW_PERCENTAGE } from '$lib/constants';

export const TOOLTIPS = {
	SWAPS:
		'Swaps are a new feature, currently in beta, that let you trade USDC for another token on Arbitrum. More Tokens coming soon!',
	ETH_DEPOSIT: `When you take out a loan, your ETH is held as collateral until you repay the loan. With Ambos you can borrow up to ${MAX_BORROW_PERCENTAGE}% of the USD value of your ETH.`,
	TOTAL_BORROW:
		'The total USD value that you will be borrowing, this includes the Ambos fee and any network fees, which will be added to the total amount you need to repay.',
	GAS_FEES: 'Network fees to send your transaction, these are not controlled by Ambos',
	GAS_FEES_ERC20: 'Network fees to send your transaction, these are not controlled by Ambos',
	ETH_SUPPLIED:
		'The amount of ETH you supplied as a collateral to secure your loan. Once the loan + interest are repaid, this amount will be sent back into your Ambos wallet.',
	USD_BORROWED:
		'The amount of stablecoins that you received as a loan - these can later be converted to fiat. The max amount you can borrow depends on the amount of principal you supplied.',
	LIQUIDATION_PRICE:
		'The threshold price of the token at which the amount of collateral you supplied to secure your loan will be sold or liquidated in order to repay the borrowed amount and any outstanding fees.',
	LOAN_HEALTH:
		'Indicates the stability of your loan. The indicator shows how well the collateral you provided covers the loan and what your current risk of liquidation is.',
	LOAN_REPAY:
		'By using the repayment option, you can repay both the principal you borrowed and the accrued interest. Once your loan is repaid in full, you will be able to withdraw the collateral you supplied.',
	NETWORK: 'The blockchain network you are currently connected to',
	WALLET_HOLDINGS:
		'The tokens you currently hold in your wallet. Please note that your wallet holdings do not include the tokens you supplied as collateral for your loan.',
	TRANSACTION_FEE: 'The fee you will pay to make the transaction. This is not controlled by Ambos.',
	REPAY_WITH_COLLATERAL:
		'Repay your loan using part of the value of ETH that you have supplied. Part of your ETH will be sold at the current market price and the proceeds will be used to repay your loan. You keep the rest.',
	REPAY_FROM_WALLET: 'Use USDC or ETH in your Ambos wallet to repay your loan.',
	REPAY_FROM_TRANSFER: 'Transfer USDC or ETH from another wallet to repay your loan.'
};
