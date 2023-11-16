<script lang="ts">
	import BuySell from './dialogues/buy-sell.svelte';
	import Receive from './dialogues/recieve.svelte';
	import Withdraw from './dialogues/withdraw.svelte';

	export let triggers = {
		buy: () => {},
		sell: () => {},
		receive: () => {},
		withdraw: () => {}
	};
</script>

<BuySell bind:trigger={triggers.buy} title="Buy" direction="buy" />
<BuySell bind:trigger={triggers.sell} title="Sell" direction="sell" />
<Receive bind:trigger={triggers.receive} />
<Withdraw bind:trigger={triggers.withdraw} />
