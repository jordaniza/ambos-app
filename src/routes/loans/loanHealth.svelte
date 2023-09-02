<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
import { Card } from "$lib/components/ui/card";
	import CardContent from "$lib/components/ui/card/card-content.svelte";
	import CardDescription from "$lib/components/ui/card/card-description.svelte";
	import CardFooter from "$lib/components/ui/card/card-footer.svelte";
	import CardHeader from "$lib/components/ui/card/card-header.svelte";
	import CardTitle from "$lib/components/ui/card/card-title.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { cn, f } from "$lib/utils";
	import { web3Store } from "$stores/web3";
	import SafetyBadge from "./safetyBadge.svelte";

  $: aWethBalance = $web3Store.balances['aWETH'].small ?? 0;
  $: etherPrice = $web3Store.ethPrice.small ?? 0;
  $: owedUSD =  $web3Store.userPoolData?.totalDebtBase.small ?? 0;
  $: supplied = $web3Store.userPoolData?.totalCollateralBase.small ?? 0;
  $: liquidationThreshold = $web3Store.userPoolData?.currentLiquidationThreshold.small ?? 0;

  function getLiquidationPrice(debtValueUSD: number, collateralInEth: number, ethPrice: number, maxLTV: number): number {
    // we need to work out the price at which the collateral becomes worth less than maxLTV% of the debtValueUSD
    // P = (D / C) / (maxLTV)
    // Eg: ($5000 Debt / 2 ETH) = $2500 per ETH 
    //    $2500 per ETH / (50% maxLTV) = $5000 per ETH
    if (collateralInEth === 0 || maxLTV === 0) return 0;
    const debtPerCollateralDeposited = debtValueUSD / collateralInEth;
    const liquidationPrice = debtPerCollateralDeposited / maxLTV;
    return liquidationPrice
  }

  $: liquidationPrice = getLiquidationPrice(owedUSD, aWethBalance, etherPrice, liquidationThreshold);
  $: isSafe = liquidationPrice < etherPrice / 2;

 </script>
    <Card class={cn("w-full")}>
      <CardHeader>
        <div class="flex justify-between mb-5">
          <CardTitle>Loan Health</CardTitle>
                <SafetyBadge isSafe={isSafe} />

        </div>
        <CardDescription>
          Loan health refers to the value of your principal (ETH) compared to
          the US Dollar value of the loan.
          <br />
          <br />
          The liquidation price is the price of ETH in US Dollars above which
          your loan is safe. If the price of ETH drops below this price, your
          loan is at risk of being liquidated.
        </CardDescription>
      </CardHeader>

      <Separator class=" mb-5" />
      <CardContent>
        <ul class="list-disc list-inside">
          <li class="flex justify-between">
            <div>Ether Supplied</div>
            <div>{aWethBalance.toFixed(2)} ETH</div>
          </li>
          <li class="flex justify-between">
            <div>Ether Price</div>
            <div>{f(etherPrice)}</div>
          </li>
          <li class="flex justify-between">
            <div>Ether Value</div>
            <div>{f(supplied)}</div>
          </li>
          <Separator class="my-3" />
          <li class="flex justify-between">
            <div>Liquidation Price</div>
            <div>{f(liquidationPrice)}</div>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button class="w-1/2 mr-1">
          Add Principal
        </Button>
        <Button class="w-1/2 ml-1" variant="secondary">
          Remove Principal
        </Button>
      </CardFooter>
    </Card>

