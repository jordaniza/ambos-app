# Ambos Finance

This application is written in Sveltekit and deployed on Vercel.

Automated deployment is set up for the `main` branch, with a staging environment for the `develop` branch.

src/(landing) is the static landing page, which is deployed to ambos.finance
src/(app) contains the actual application. They differ in the +layout.svelte file, which is the common set of components that are shared between child pages.

## Development

```sh
yarn                             # install dependencies
yarn dev                         # run dev server
yarn build                       # build for production
yarn preview                     # preview production build

shadcn-svelte@latest add         # add a new component

 # generate typechain types for json files in the src/lib/abis/json folder
yarn typechain

yarn test:{unit,integration,e2e} # run tests
```

## Data Flow

Most data lives in the [stores][./src/stores] directory. This includes most async data fetched from the blockchain. Svelte stores can be subscribed to, and will update automatically when the data changes, so this avoids doing extensive data fetching in components.

> Make sure you use svelte context wrappers for the store to avoid sharing state between users on the server. The +layout.svelte page has examples of this.

In our root +layout we initialize the app with some data fetches, and setup some simple watchers to query the blockchain on an interval. This means you can simply subscribe to the store in your component and it will update automatically.

The transaction store in particular has a simple counter that can be incremented when a new transaction is sent. This is used to trigger an immediate re-fetch of the data.

## PWA

PWA is enabled by VitePWA for Sveltekit using the injectManifest method. The relevant files:

- prompt-sw.ts: the workbox service worker
- ReloadPrompt.svelte: the prompt that is shown when a new version is available, also serves to register the service worker if it isn't already.
- vite.config.ts::plugins::SvelteKitPWA - the VitePWA plugin configuration

Note that the app is served with prerender=true and will cache static assets. Ensure you're aware of this, and the implications for SSR. In our case, this is a blockchain app, so it's client-heavy and doesn't need to be indexed by search engines.

## Testing

Vitest can be run in unit, integration or e2e mode. Scripts are in the package.json file.
Define each test suite by creating a file with the {unit,integration,e2e}.spec.ts extension.

Vitest scans for all files in src that contains {unit,integration,e2e}.spec.ts and runs them.
