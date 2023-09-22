# Ambos Finance

This application is written in Sveltekit and deployed on Vercel.

Automated deployment is set up for the `main` branch, with a staging environment for the `develop` branch.

src/(landing) is the static landing page, which is deployed to ambos.finance
src/(app) contains the actual application. They differ in the +layout.svelte file, which is the common set of components that are shared between child pages.

## Development

```sh
yarn                        # install dependencies
yarn dev                    # run dev server
yarn build                  # build for production
yarn preview                # preview production build

shadcn-svelte@latest add    # add a new component

yarn typechain              # generate typechain types for json files in the src/lib/abis/json folder

yarn test                   # run tests
```

## Data Flow

Most data lives in the [stores][./src/stores] directory. This includes most async data fetched from the blockchain. Svelte stores can be subscribed to, and will update automatically when the data changes, so this avoids doing extensive data fetching in components.

> Make sure you use svelte context wrappers for the store to avoid sharing state between users on the server. The +layout.svelte page has examples of this.

In our root +layout we initialize the app with some data fetches, and setup some simple watchers to query the blockchain on an interval. This means you can simply subscribe to the store in your component and it will update automatically.

The transaction store in particular has a simple counter that can be incremented when a new transaction is sent. This is used to trigger an immediate re-fetch of the data.
