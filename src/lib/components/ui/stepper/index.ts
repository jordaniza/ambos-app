import type { ROUTES } from '$lib/constants';

export type Step = {
	route: (typeof ROUTES)[keyof typeof ROUTES];
	name: string;
};
