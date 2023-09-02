import { c as create_ssr_component, L as add_attribute, M as escape, o as subscribe, v as validate_component } from "../../../chunks/ssr.js";
import { j as cn, S as Separator, m as f, B as Button, R as ROUTES, W as WHAT_IS_AAVE, A as APP_NAME } from "../../../chunks/separator.js";
import { C as Card_description, a as Card_footer } from "../../../chunks/card-footer.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../chunks/card-content.js";
import { w as web3Store } from "../../../chunks/index3.js";
const SafetyBadge = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isSafe = true } = $$props;
  if ($$props.isSafe === void 0 && $$bindings.isSafe && isSafe !== void 0)
    $$bindings.isSafe(isSafe);
  return `<div${add_attribute(
    "class",
    `rounded-md w-1/6 text-sm text-center border font-bold
          ${/* dark mode */
    isSafe ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
      `,
    0
  )}>${escape(isSafe ? "Safe" : "At Risk")}</div>`;
});
function getLiquidationPrice(debtValueUSD, collateralInEth, ethPrice, maxLTV2) {
  if (collateralInEth === 0 || maxLTV2 === 0)
    return 0;
  const debtPerCollateralDeposited = debtValueUSD / collateralInEth;
  const liquidationPrice2 = debtPerCollateralDeposited / maxLTV2;
  return liquidationPrice2;
}
const LoanHealth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let aWethBalance;
  let etherPrice;
  let owedUSD;
  let supplied;
  let liquidationThreshold;
  let liquidationPrice;
  let isSafe;
  let $web3Store, $$unsubscribe_web3Store;
  $$unsubscribe_web3Store = subscribe(web3Store, (value) => $web3Store = value);
  aWethBalance = $web3Store.balances["aWETH"].small ?? 0;
  etherPrice = $web3Store.ethPrice.small ?? 0;
  owedUSD = $web3Store.userPoolData?.totalDebtBase.small ?? 0;
  supplied = $web3Store.userPoolData?.totalCollateralBase.small ?? 0;
  liquidationThreshold = $web3Store.userPoolData?.currentLiquidationThreshold.small ?? 0;
  liquidationPrice = getLiquidationPrice(owedUSD, aWethBalance, etherPrice, liquidationThreshold);
  isSafe = liquidationPrice < etherPrice / 2;
  $$unsubscribe_web3Store();
  return `${validate_component(Card, "Card").$$render($$result, { class: cn("w-full") }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="flex justify-between mb-5">${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
            default: () => {
              return `Loan Health`;
            }
          })} ${validate_component(SafetyBadge, "SafetyBadge").$$render($$result, { isSafe }, {}, {})}</div> ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
            default: () => {
              return `Loan health refers to the value of your principal (ETH) compared to
          the US Dollar value of the loan.
          <br> <br>
          The liquidation price is the price of ETH in US Dollars above which
          your loan is safe. If the price of ETH drops below this price, your
          loan is at risk of being liquidated.`;
            }
          })}`;
        }
      })} ${validate_component(Separator, "Separator").$$render($$result, { class: " mb-5" }, {}, {})} ${validate_component(Card_content, "CardContent").$$render($$result, {}, {}, {
        default: () => {
          return `<ul class="list-disc list-inside"><li class="flex justify-between"><div data-svelte-h="svelte-95xhke">Ether Supplied</div> <div>${escape(aWethBalance.toFixed(2))} ETH</div></li> <li class="flex justify-between"><div data-svelte-h="svelte-ivn543">Ether Price</div> <div>${escape(f(etherPrice))}</div></li> <li class="flex justify-between"><div data-svelte-h="svelte-1ijaou7">Ether Value</div> <div>${escape(f(supplied))}</div></li> ${validate_component(Separator, "Separator").$$render($$result, { class: "my-3" }, {}, {})} <li class="flex justify-between"><div data-svelte-h="svelte-i2h9ee">Liquidation Price</div> <div>${escape(f(liquidationPrice))}</div></li></ul>`;
        }
      })} ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { class: "w-1/2 mr-1" }, {}, {
            default: () => {
              return `Add Principal`;
            }
          })} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              class: "w-1/2 ml-1",
              variant: "secondary"
            },
            {},
            {
              default: () => {
                return `Remove Principal`;
              }
            }
          )}`;
        }
      })}`;
    }
  })}`;
});
const LoanOwed = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let owed;
  let availableToBorrow;
  let variableRateIR;
  let $web3Store, $$unsubscribe_web3Store;
  $$unsubscribe_web3Store = subscribe(web3Store, (value) => $web3Store = value);
  owed = $web3Store.userPoolData?.totalDebtBase.small ?? 0;
  availableToBorrow = $web3Store.userPoolData?.availableBorrowBase.small ?? 0;
  variableRateIR = $web3Store.poolReserveData?.variableBorrowingRate.small ?? 0;
  $$unsubscribe_web3Store();
  return `${validate_component(Card, "Card").$$render($$result, { class: cn("w-full") }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
            default: () => {
              return `Owed`;
            }
          })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
            default: () => {
              return `This is the total amount you need to repay in USDC to unlock and reclaim your ETH. It is the
			original amount in USD, plus accumulated interest.`;
            }
          })}`;
        }
      })} ${validate_component(Card_content, "CardContent").$$render($$result, {}, {}, {
        default: () => {
          return `<ul class="list-disc list-inside"><li class="flex justify-between"><div data-svelte-h="svelte-135qpo2">Total Borrowed</div> <div>${escape(f(owed))}</div></li> <li class="flex justify-between"><div data-svelte-h="svelte-1k479y7">Available To Borrow</div> <div>${escape(f(availableToBorrow))}</div></li> <li class="flex justify-between"><div data-svelte-h="svelte-1rmbbjq">Interest Rate</div> <div>${escape(variableRateIR.toFixed(2))}%</div></li></ul>`;
        }
      })} ${validate_component(Separator, "Separator").$$render($$result, { class: " mb-5" }, {}, {})} ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { class: "w-1/2 mr-1" }, {}, {
            default: () => {
              return `Repay`;
            }
          })} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              class: "w-1/2 ml-1",
              variant: "secondary"
            },
            {},
            {
              default: () => {
                return `Borrow More`;
              }
            }
          )}`;
        }
      })}`;
    }
  })}`;
});
let maxLTV = 50;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<section class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">${validate_component(Card, "Card").$$render($$result, { class: cn("w-full") }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
            default: () => {
              return `Loans`;
            }
          })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
            default: () => {
              return `Here you can see your loan positions and manage your loan balances. Loans are made in ETH
				and allow you to withdraw USDC, which can be converted for a currency of your choice.
				<br> <br>
				If the value of your ETH drops below${escape(" ")} ${escape(maxLTV)}% of the US Dollar value of the loan, you will be at risk of being liqudiated and
				your ETH will be used to pay off the loan automatically. If this happens, you do not need to
				repay the loan.
				<br> <br> ${escape(APP_NAME)}${escape(" ")}
				places restrictions on the amount you can borrow to give you a safety buffer, this is currently
				set at ${escape(maxLTV)}%.`;
            }
          })}`;
        }
      })} ${validate_component(Separator, "Separator").$$render($$result, { class: " mb-5" }, {}, {})} ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { class: "w-1/2 mr-1" }, {}, {
            default: () => {
              return `<a${add_attribute("href", ROUTES.NEW_LOAN, 0)} class="w-full" data-svelte-h="svelte-167t4m4">Get Started</a>`;
            }
          })} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              class: "w-1/2 ml-1",
              variant: "secondary"
            },
            {},
            {
              default: () => {
                return `<a${add_attribute("href", WHAT_IS_AAVE, 0)} target="_blank" class="w-full" data-svelte-h="svelte-1b104l1">More Info</a>`;
              }
            }
          )}`;
        }
      })}`;
    }
  })} ${validate_component(LoanOwed, "LoanOwed").$$render($$result, {}, {}, {})} ${validate_component(LoanHealth, "LoanHealth").$$render($$result, {}, {}, {})}</section>`;
});
export {
  Page as default
};
