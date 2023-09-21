import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			devOptions: {
				enabled: true
			},
			registerType: 'autoUpdate',
			manifest: {
				name: 'Ambos Finance',
				short_name: 'Ambos',
				start_url: '/dashboard',
				display: 'standalone',
				description:
					'Get cash for your crypto today, without selling, in a streamlined, secure, non-custodial application.',
				background_color: '#f6edfd',
				theme_color: '#48b25c',
				// use the pwa-asset-generator to generate icons and splash screens, see package.json
				icons: [
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png'
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			}
		}),
		purgeCss(),
		nodePolyfills({
			// Whether to polyfill specific globals.
			globals: {
				Buffer: true // can also be 'build', 'dev', or false
			}
		})
	],
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			},
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true
				})
			]
		}
	},
	resolve: {
		alias: {
			process: 'process/browser',
			stream: 'stream-browserify',
			util: 'util'
		}
	}
});
