<script lang="ts">
	import Ramp from '$lib/components/ramp/ramp.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { ITransakDto } from '$lib/components/ramp/Interface';

	export const trigger = () => {
		open = true;
	};

	export let open = false;
	export let title: string;
	export let direction: 'buy' | 'sell' = 'buy';

	let openTransak = false;
	let options: Partial<ITransakDto> = {
		defaultCryptoCurrency: 'ETH',
		cryptoCurrencyList: 'ETH,WETH'
	};

	type HandleBuyProps = {
		currency: 'ETH' | 'WETH' | 'USDC';
	};
	type HandleSellProps = {
		currency: 'ETH' | 'WETH' | 'USDC';
	};

	function handleSell({ currency }: HandleSellProps) {
		options.cryptoCurrencyList = currency;
		options.cryptoCurrencyCode = currency;
		options.exchangeScreenTitle = `Sell ${currency}`;
		if (currency === 'ETH' || currency === 'WETH') {
			options.defaultCryptoAmount = 2;
		} else if (currency === 'USDC') {
			options.defaultCryptoAmount = 1000;
		}
	}

	function handleBuy({ currency }: HandleBuyProps) {
		options.defaultCryptoCurrency = currency;
		options.cryptoCurrencyList = currency;
		options.exchangeScreenTitle = `Buy ${currency}`;
	}

	function handleBuySell(props: HandleBuyProps | HandleSellProps) {
		open = false;
		openTransak = true;
		if (direction === 'buy') {
			handleBuy(props as HandleBuyProps);
		} else {
			handleSell(props as HandleSellProps);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.FlyInContent class="bg-popover">
		<Dialog.Title class="font-xl font-extrabold text-center">{title}</Dialog.Title>
		<div class="flex flex-col p-4 gap-3">
			<button
				on:click={() => handleBuySell({ currency: 'WETH' })}
				class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
			>
				<div class="flex items-center gap-2">
					<img src="/external/eth.png" alt="eth" class="h-8 w-8" />
					<p>Ether</p>
				</div>
				<p>ETH</p>
			</button>
			<button
				on:click={() => handleBuySell({ currency: 'USDC' })}
				class="bg-background cursor-pointer rounded-2xl p-3 font-bold text-sm flex items-center justify-between shadow-none"
			>
				<div class="flex items-center gap-2">
					<img src="/external/usdc.png" alt="eth" class="h-8 w-8" />
					<p>USDC</p>
				</div>
				<p>USDC</p>
			</button>
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>

<Dialog.Root bind:open={openTransak}>
	<Dialog.FlyInContent class="bg-popover">
		<div class="flex w-full flex-col gap-5">
			<p class="font-3xl font-extrabold text-center">{title}</p>
			<Ramp class="border-0 h-[600px] w-full" {options} {direction} />
		</div>
	</Dialog.FlyInContent>
</Dialog.Root>
