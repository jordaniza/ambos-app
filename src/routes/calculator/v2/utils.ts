// fetch the ethSupplyQty from the url param
export function getEthSupplyQty(): number | null {
	return getNumberFromParams('ethSupplyQty');
}

export function getBorrowAmountUSD(): number | null {
	return getNumberFromParams('borrowAmountUSD');
}

export function getEthPriceChange(): number | null {
	return getNumberFromParams('ethPriceChange');
}

function getNumberFromParams(param: string): number | null {
	const params = new URLSearchParams(window.location.search);
	const res = params.get(param);
	if (!res || Number.isNaN(res)) return null;
	return Number(res);
}
