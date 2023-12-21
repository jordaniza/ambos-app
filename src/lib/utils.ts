import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { type BigNumberish, ethers, BigNumber } from 'ethers';

export type EthereumAddress = `0x${string}`;
export const BN = (n: BigNumberish) => ethers.utils.parseEther(n.toString());
export const USDC = (n: BigNumberish) => ethers.utils.parseUnits(n.toString(), 6);
export const N = (n: BigNumberish) => ethers.utils.formatEther(n);
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	currencyDisplay: 'code', // This will use the currency code 'USD'
	minimumFractionDigits: 2 // Ensures decimal places are always shown
});

export const f = (n: number) => {
	if (n > 0 && n < 0.01) {
		return '<$0.01';
	}
	// Replace 'USD' with '$' including the space
	return formatter.format(n).replace('USD', '$');
};

// format = 0.00 SYMBOL (for stablecoins)
export const stbl = (n: number, s: string) => {
	const formatted = formatter.format(n).replace('USD', '');
	return `${formatted.slice(1)} ${s}`;
};

// general formatting for numbers that might be very large
// or very small, or in between
export function fmt(n: number): string {
	// add commas
	// with large, round it to nearest whole
	// if between say 10 and 100 max 2 decimals
	// if between 1 and 10 max 4 decimals
	// if between 0.01 and 1 max 6 decimals
	// if between 0.0001 and 0.01 max 8 decimals
	// if between 0.00000001 and 0.0001 max 10 decimals
	// if less than 0.00000001 max 12 decimals

	switch (true) {
		case n > 100:
			return n.toLocaleString();
		case n > 10:
			return n.toFixed(2);
		case n > 1:
			return n.toFixed(4);
		case n > 0.01:
			return n.toFixed(6);
		case n > 0.0001:
			return n.toFixed(8);
		case n > 0.00000001:
			return n.toFixed(10);
		default:
			return n.toFixed(12);
	}
}

// eth formatting
export const e = (n: number) => (n > 1 ? n.toFixed(2) : n.toFixed(4));

// percentage formatting
export const pc = (n: number) => (n < 0.01 ? `${n.toFixed(4)}%` : `${n.toFixed(2)}%`);

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function classNames(...classes: (false | null | undefined | string)[]): string {
	return classes.filter(Boolean).join(' ');
}

export function getLiquidationPrice(
	debtValueUSD: number,
	collateralInEth: number,
	maxLTV: number
): number {
	// we need to work out the price at which the collateral becomes worth less than maxLTV% of the debtValueUSD
	// P = (D / C) / (maxLTV)
	// Eg: ($5000 Debt / 2 ETH) = $2500 per ETH
	//    $2500 per ETH / (50% maxLTV) = $5000 per ETH
	if (collateralInEth === 0 || maxLTV === 0) return 0;
	const debtPerCollateralDeposited = debtValueUSD / collateralInEth;
	const liquidationPrice = debtPerCollateralDeposited / maxLTV;
	return liquidationPrice;
}

export function getBarColor(barWidth: number): string {
	switch (true) {
		case barWidth > 75:
			return 'bg-destructive';
		case barWidth > 60:
			return 'bg-orange-300';
		case barWidth > 50:
			return 'bg-yellow-300';
		case barWidth > 25:
			return 'bg-green-300';
		default:
			return 'bg-primary';
	}
}

export function getTextColor(barWidth: number): string {
	switch (true) {
		case barWidth > 75:
			return 'text-destructive';
		case barWidth > 60:
			return 'text-orange-500';
		case barWidth > 50:
			return 'text-yellow-500';
		case barWidth > 25:
			return 'text-green-500';
		default:
			return 'text-primary';
	}
}

export async function delay(ms: number) {
	return await new Promise((resolve) => setTimeout(resolve, ms));
}

export function withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error('timeout'));
		}, timeout);

		promise
			.then((value) => {
				clearTimeout(timer);
				resolve(value);
			})
			.catch((reason) => {
				clearTimeout(timer);
				reject(reason);
			});
	});
}

// Serializable Value
type SV =
	| string
	| number
	| boolean
	| string[]
	| number[]
	| boolean[]
	| BigNumber
	| BigNumber[]
	| undefined;

export function objToQsp<T extends Record<string, SV>>(obj: T): string {
	return Object.keys(obj)
		.map((key: keyof T) => {
			const value = obj[key];
			if (Array.isArray(value)) {
				return value
					.map((v) => `${encodeURIComponent(key as string)}=${encodeURIComponent(String(v))}`)
					.join('&');
			}
			return `${encodeURIComponent(key as string)}=${encodeURIComponent(String(value))}`;
		})
		.join('&');
}
