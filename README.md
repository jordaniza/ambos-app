# Ambos Finance

This application is written in Sveltekit and deployed on Vercel.

Automated deployment is set up for the `main` branch, with a staging environment for the `develop` branch.

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

## Transaction Workflow

Main async transactions live in the store. There is a dedicated txStore that handles the tx lifecycle. Your individual transactions should hook into the templates and helper functions in the store directory.

We try and separate the tx data flow from the UI:

- Creating a new transaction creates a new 'watched' transactionID in the txStore
- the relevant watched transaction are fetched in a global notification manager
- this, in turn, conditionally renders the relevant notification component, including toasts and modals
- Most txData is generic over the txType, however you can add data to the context property to fetch it in the notification component

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

Biconomy Paymasters are a bit tricky to test as they require the API. I recommend building the transactions on a network fork using hardhat, and then porting the JS code across.

Aave and Biconomy use different testing tokens, which makes reconciling the two a bit of a challenge. The same for the 0x API, which doesn't have test endpoints that work well with the other two. In general, try and test component parts in isolation - it may be that small value transactions on live are the only real option to test everything together at this stage.

## Deployment

Currently, Ambos is single chain, but can be deployed on multiple chains. When deploying for a new chain, ensure a few things:

1. The chain has been configured as the root chain in the +layout.svelte file
2. Ensure the ethers providers, particle and biconomy components have been set to suppor the chain
3. Ensure the contract addresses are set for the chain

- ADDRESSES struct is updated
- If needed, a different testnet USDC can be set for the biconomy paymaster.
- Add to the BLOCK EXPLORERS in the same file

4. Ensure the API keys are correctly set:

- Particle
- Transak
  - Transak options are set
- Biconomy Paymasters
  - Gas tank created
  - Contracts whitelisted

5. On sidechains, configure to use WETH over ETH, on rollups, use ETH
6. Ensure the logos are set in Network Names, Network Logos
7. Ensure Vercel is updated
8. Ensure the fee collector actually receives fees
