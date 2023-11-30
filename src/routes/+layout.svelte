<script lang="ts">
	import { browser } from '$app/environment';
	import * as env from '$env/static/public';
	import { onMount } from 'svelte';
	import '../app.postcss';
	import { pwaInfo } from 'virtual:pwa-info';
	// required for PWA Support
	$: webManifestLink = pwaInfo?.webManifest.linkTag ?? '';
	$: gtmTag = env.PUBLIC_GOOGLE_TAG_MANAGER_ID;

	onMount(() => {
		// google tag manager
		(function (w: any, d: any, s: any, l: any, i: any) {
			w[l] = w[l] || [];
			w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
			var f = d.getElementsByTagName(s)[0],
				j = d.createElement(s),
				dl = l != 'dataLayer' ? '&l=' + l : '';
			j.async = true;
			j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
			// Check if the target element exists, otherwise use the head as a fallback
			if (f && f.parentNode) {
				f.parentNode.insertBefore(j, f);
			} else {
				d.head.appendChild(j);
			}
		})(window, document, 'script', 'dataLayer', gtmTag);
	});

	$: gtmNoscript =
		gtmTag &&
		`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmTag}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>
{#if gtmNoscript}
	{@html gtmNoscript}
{/if}
<slot />

{#await import('$lib/components/pwa/ReloadPrompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await}
