import { SupportedSwapTokens, TOKEN_LIST_URL } from '$lib/contracts';
import type { ChainId } from '@biconomy/core-types';

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

async function fetchCacheCoinGeckoTokenList(chainId: ChainId): Promise<Token[] | []> {
	const url = TOKEN_LIST_URL[chainId];
	if (!url) return [];

	let tokens = localStorage.getItem(url);
	if (!tokens) {
		const res = await fetch(url);
		const data = await res.json();
		localStorage.setItem(url, JSON.stringify(data));
		tokens = JSON.stringify(data);
	}

	const parsedArray = JSON.parse(tokens!) as CoinGeckoAPIResponse;
	return extractCoinGecko(parsedArray);
}

type SupportedTokenReturn = {
	default: Token;
	list: Token[];
};

export async function getSupportedTokensFromCoinGecko(chainId: ChainId): Promise<{
	in: SupportedTokenReturn;
	out: SupportedTokenReturn;
}> {
	const { in: supportIn, out: supportOut } = SupportedSwapTokens;
	const justTokens = await fetchCacheCoinGeckoTokenList(chainId);
	const inTokens = justTokens.filter((token: Token) =>
		SupportedSwapTokens.in.list.includes(token.symbol as any)
	);
	const outTokens = justTokens.filter((token: Token) =>
		SupportedSwapTokens.out.list.includes(token.symbol as any)
	);
	const inToken = inTokens.find((token) => token.symbol === supportIn.default)!;
	const outToken = outTokens.find((token) => token.symbol === supportOut.default)!;

	return {
		in: {
			default: inToken,
			list: inTokens
		},
		out: {
			default: outToken,
			list: outTokens
		}
	};
}
