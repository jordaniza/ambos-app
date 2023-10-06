<script lang="ts">
	import Entrypoint from './dialogues/entrypoint.svelte';

	export let triggers = {
		buy: () => {},
		sell: () => {},
		receive: () => {},
		transfer: () => {},
		withdraw: () => {}
	};
</script>

<Entrypoint bind:trigger={triggers.buy} title="Buy" />
<Entrypoint bind:trigger={triggers.sell} title="Sell" />
<Entrypoint bind:trigger={triggers.receive} title="Receive" />
<Entrypoint bind:trigger={triggers.transfer} title="Transfer" />
<Entrypoint bind:trigger={triggers.withdraw} title="Withdraw" />
