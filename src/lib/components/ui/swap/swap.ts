export type Token = {
	chainId: number;
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	logoURI: string;
};
export type CoinGeckoAPIResponse = {
	tokens: Token[] | Token[][];
};

export function extractCoinGecko(input: CoinGeckoAPIResponse): Token[] {
	const tokens = input.tokens;
	if (Array.isArray(tokens[0])) {
		// iterate over each group of tokens
		const tokenGroups = tokens as Token[][];
		const flattenedTokens = tokenGroups.reduce((acc, tokenGroup) => {
			return [...acc, ...tokenGroup];
		}, []);
		return flattenedTokens;
	} else {
		return tokens as Token[];
	}
}
