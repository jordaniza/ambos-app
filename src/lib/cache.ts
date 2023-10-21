import { LOCAL_STORAGE_KEYS } from './constants';

type APIResponse = {
	prices: [number, number][];
};

type PriceData = { x: number; y: number }[];

type LocalStorageKey = (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];
/**
 * Save data to local storage with an expiry
 * Data is encoded as a stringified JSON object with a timestamp
 * But then decoded and returned as the original type
 * Must implement error handling at the component level
 * @param key registered key in constants.ts
 * @param expiry in milliseconds
 * @param networkRequest callback to fetch data from the network
 * @returns T the data
 */
export async function cacheFetch<T>(
	key: LocalStorageKey,
	expiry: number,
	networkRequest: () => Promise<T>
): Promise<T> {
	const cachedData = localStorage.getItem(key);
	if (cachedData) {
		const parsedData = JSON.parse(cachedData);
		const isDataFresh = Date.now() - parsedData.timestamp < expiry;

		if (isDataFresh) {
			return parsedData.data;
		}
	}

	const data = await networkRequest();
	localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
	return data;
}

const API_ENDPOINT =
	'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=14&interval=daily&precision=2';

export async function getEthPriceData(): Promise<PriceData> {
	const key = LOCAL_STORAGE_KEYS.CACHED_CHART_DATA;
	const expiry = 3600000; // 1 hour
	return await cacheFetch(key, expiry, async () => {
		const res = await fetch(API_ENDPOINT);
		const json = (await res.json()) as APIResponse;
		return json.prices.map(([_, y], i) => ({ x: i, y }));
	});
}

export async function getChangeInEthPrice(): Promise<number> {
	const prices = await getEthPriceData();

	const last = prices[prices.length - 1].y;
	const lastMinusOne = prices[prices.length - 2].y;

	return (100 * (last - lastMinusOne)) / lastMinusOne;
}
