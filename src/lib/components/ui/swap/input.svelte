<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Token } from './swap';

	export let tokens: Token[] = [];
	export let token: Token;
	export let tokenQty = 0;
	export let readonly = false;

	let searchTerm = '';
	let isOpen = false;
	let inputElement: HTMLInputElement;

	$: filteredTokens = tokens.filter((t) =>
		t.symbol.toLowerCase().includes(searchTerm.toLowerCase())
	);

	$: if (inputElement) inputElement.focus();

	function handleSelectToken(symbol: string) {
		const selected = tokens.find((t) => t.symbol === symbol);
		if (selected) {
			token = selected;
		} else {
			console.warn(`Token with symbol ${symbol} not found`);
		}
	}

	function handleOpenChange(open: boolean) {
		isOpen = open;
		if (open) focusOnInput();
	}

	function focusOnInput() {
		if (inputElement) inputElement.focus();
	}
</script>

<!-- Token selection and search UI -->
<div class="bg-white py-2 flex w-full justify-between gap-2">
	<div class="grow-0 min-w-[25%]">
		<Select.Root onOpenChange={handleOpenChange} bind:open={isOpen} highlightOnHover={true}>
			<Select.Trigger class="gap-2 flex items-center justify-between">
				{#if !isOpen}
					<div class="flex gap-2 items-center">
						<img src={token.logoURI} alt={token.symbol} class="h-5 w-5" />
						<p>{token.symbol}</p>
					</div>
				{:else}
					<div class="p-2">
						<input
							type="text"
							bind:this={inputElement}
							placeholder="Search..."
							class="w-full p-2"
							bind:value={searchTerm}
						/>
					</div>
				{/if}
			</Select.Trigger>
			<Select.Content>
				{#each filteredTokens as token}
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
