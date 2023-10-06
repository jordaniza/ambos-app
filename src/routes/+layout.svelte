<script lang="ts">
	import '../app.postcss';

	import { accountStore as _accountStore } from '$stores/account';
	import { web3Store as _web3Store } from '$stores/web3';
	import { txStore as _txStore } from '$stores/transactions/state';
	import { pwaInfo } from 'virtual:pwa-info';

	// required for PWA Support
	$: webManifestLink = pwaInfo?.webManifest.linkTag ?? '';
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<slot />

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await}
