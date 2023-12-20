<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Token } from './swap';

	export let tokens: Token[] = [];
	export let token: Token;
	export let tokenQty = 0;
	export let readonly = false;

	function handleSelectToken(symbol: string) {
		const selected = tokens.find((token) => token.symbol === symbol);
		if (selected) {
			token = selected;
		} else {
			console.warn(`Token with symbol ${symbol} not found`);
		}
	}
</script>

<div class="bg-white py-2 flex w-full justify-between gap-2">
	<div class="grow-0 min-w-[25%]">
		<Select.Root>
			<Select.Trigger class="gap-2 flex items-center justify-between">
				<div class="flex gap-2 items-center">
					<img src={token.logoURI} alt={token.symbol} class="h-5 w-5" />
					<p>{token.symbol}</p>
				</div>
			</Select.Trigger>
			<Select.Content>
				{#each tokens as token}
					<Select.Item
						class="pl-0"
						value={token.symbol}
						on:click={() => handleSelectToken(token.symbol)}
					>
						<div class="flex items-center p-2 gap-1">
							<img src={token.logoURI} alt={token.symbol} class="h-5 w-5" />
							<span>{token.symbol}</span>
						</div>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
	<input type="number" disabled={readonly} class="p-2 grow" bind:value={tokenQty} />
</div>
