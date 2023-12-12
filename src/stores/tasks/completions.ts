import type { EthereumAddress } from '$lib/utils';
import { NAMED_TASKS, completeTask, type taskStore } from '.';

// should complete by default
export function taskInstallApp(store: typeof taskStore, scw: EthereumAddress) {
	completeTask(store, NAMED_TASKS.INSTALL_APP, scw);
}

// will fire if the user has a username
export function taskSetUsername(
	store: typeof taskStore,
	scw: EthereumAddress,
	username: string | undefined
) {
	if (username) completeTask(store, NAMED_TASKS.SET_USERNAME, scw);
}

// will fire if the user has a referral
export function taskGetReferral(
	store: typeof taskStore,
	scw: EthereumAddress,
	referral: string | undefined
) {
	if (referral) completeTask(store, NAMED_TASKS.GET_REFERRAL, scw);
}
