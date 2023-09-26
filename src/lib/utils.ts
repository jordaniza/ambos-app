import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { type BigNumberish, ethers } from 'ethers';

export type EthereumAddress = `0x${string}`;
export const BN = (n: BigNumberish) => ethers.utils.parseEther(n.toString());
export const USDC = (n: BigNumberish) => ethers.utils.parseUnits(n.toString(), 6);
export const N = (n: BigNumberish) => ethers.utils.formatEther(n);
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
const { format } = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

// apply default usd formatting
export const f = (n: number) => format(n);

export const e = (n: number) => (n > 10 ? n.toFixed(2) : n.toFixed(4));

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
