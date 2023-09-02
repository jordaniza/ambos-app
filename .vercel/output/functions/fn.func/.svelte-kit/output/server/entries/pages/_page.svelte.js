import { c as create_ssr_component, o as subscribe, v as validate_component, M as escape, L as add_attribute } from "../../chunks/ssr.js";
import { j as cn, m as f, S as Separator, B as Button, R as ROUTES, W as WHAT_IS_AAVE, A as APP_NAME } from "../../chunks/separator.js";
import { C as Card_description, a as Card_footer } from "../../chunks/card-footer.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../chunks/card-content.js";
import { w as web3Store } from "../../chunks/index3.js";
import { E as Eth, U as Usdc } from "../../chunks/usdc.js";
const DashboardLoans = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let owedUSD;
  let collateralValueUSD;
  let variableRateIR;
  let $web3Store, $$unsubscribe_web3Store;
  $$unsubscribe_web3Store = subscribe(web3Store, (value) => $web3Store = value);
  owedUSD = $web3Store.userPoolData?.totalDebtBase.small ?? 0;
  collateralValueUSD = $web3Store.userPoolData?.totalCollateralBase.small ?? 0;
  variableRateIR = $web3Store.poolReserveData?.variableBorrowingRate.small ?? 0;
  $$unsubscribe_web3Store();
  return `${validate_component(Card, "Card").$$render($$result, { class: cn("w-full") }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "CardTitle").$$render($$result, { class: "mb-5" }, {}, {
            default: () => {
              return `Loans Overview`;
            }
          })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
            default: () => {
              return `A summary of your current outstanding loan balances.`;
            }
          })}`;
        }
      })} <section class="grid grid-cols-2 gap-0">${validate_component(Card_content, "CardContent").$$render($$result, { class: "grid grid-cols-1 gap-4" }, {}, {
        default: () => {
          return `<div class="flex flex-col"><p class="text-sm font-medium leading-none" data-svelte-h="svelte-93lbu6">Owed</p> <p class="text-xl font-bold">${escape(f(owedUSD))}</p></div> <div class="flex flex-col"><p class="text-sm font-medium leading-none" data-svelte-h="svelte-1amr13">Supplied</p> <p class="text-xl font-bold">${escape(f(collateralValueUSD))}</p></div> <div class="flex flex-col"><p class="text-sm font-medium leading-none" data-svelte-h="svelte-4ijp85">Interest Rate</p> <p class="text-xl font-bold">${escape(variableRateIR.toFixed(3))}%</p></div>`;
        }
      })} <div class="ml-10 mt-6"></div></section> ${validate_component(Separator, "Separator").$$render($$result, { class: "mb-5" }, {}, {})} ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { class: "w-full", variant: "default" }, {}, {
            default: () => {
              return `<a class="w-full"${add_attribute("href", ROUTES.MY_LOANS, 0)} data-svelte-h="svelte-13qlvg0">Manage Loans</a>`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
const DashboardWallet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usdcBalance;
  let ethBalance;
  let ethPrice;
  let ethBalanceUSD;
  let $web3Store, $$unsubscribe_web3Store;
  $$unsubscribe_web3Store = subscribe(web3Store, (value) => $web3Store = value);
  const { format } = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  usdcBalance = $web3Store?.balances["USDC"]?.small ?? 0;
  ethBalance = $web3Store?.balances["WETH"]?.small ?? 0;
  ethPrice = $web3Store?.ethPrice?.small ?? 0;
  ethBalanceUSD = ethBalance * ethPrice;
  $$unsubscribe_web3Store();
  return `${validate_component(Card, "Card").$$render($$result, { class: "w-full" }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "CardTitle").$$render($$result, { class: "mb-5" }, {}, {
            default: () => {
              return `Wallet Overview`;
            }
          })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
            default: () => {
              return `A summary of your balances not currently in use. Go to your wallet to deposit more funds or
			withdraw.`;
            }
          })}`;
        }
      })} ${validate_component(Card_content, "CardContent").$$render(
        $$result,
        {
          class: "grid grid-cols-1 md:grid-cols-2 gap-4"
        },
        {},
        {
          default: () => {
            return `<div class="flex items-center space-x-4"><div class="h=5 w-8 p-1">${validate_component(Eth, "Eth").$$render($$result, {}, {}, {})}</div> <div class="flex flex-col"><p class="text-sm font-medium leading-none" data-svelte-h="svelte-1rmw5">Ether in Wallet</p> <p class="text-xl font-bold">${escape(ethBalance)} ETH</p> <p class="text-sm italic">${escape(format(ethBalanceUSD))}</p></div></div> <div class="flex items-center space-x-4"><div class="h=8 w-8">${validate_component(Usdc, "Usdc").$$render(
              $$result,
              {
                dark: "transparent",
                light: "white"
              },
              {},
              {}
            )}</div> <div class="flex flex-col"><p class="text-sm font-medium leading-none" data-svelte-h="svelte-1evll0w">USDC in Wallet</p> <p class="text-xl font-bold">${escape(format(usdcBalance))}</p></div></div>`;
          }
        }
      )} ${validate_component(Separator, "Separator").$$render($$result, { class: "mb-5" }, {}, {})} ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { class: "w-full" }, {}, {
            default: () => {
              return `<a class="w-full"${add_attribute("href", ROUTES.WALLET, 0)} data-svelte-h="svelte-1xvk7rt">Go To Wallet</a>`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<section class="p-4 grid grid-cols-1 gap-2">${validate_component(Card, "Card").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "CardTitle").$$render($$result, { class: "mb-5" }, {}, {
            default: () => {
              return `Welcome To ${escape(APP_NAME)}`;
            }
          })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
            default: () => {
              return `${escape(APP_NAME)} gives you the freedom to
				<span class="font-bold" data-svelte-h="svelte-4d9b45">save for tomorrow, while spending today.</span> <br> <br>
				Buy or deposit crypto, and get the fiat currency of your choice back, to spend anywhere.`;
            }
          })} <a${add_attribute("href", WHAT_IS_AAVE, 0)} target="_blank">${validate_component(Button, "Button").$$render(
            $$result,
            {
              variant: "link",
              class: "text-left pl-0 ml-0 mt-3"
            },
            {},
            {
              default: () => {
                return `Here&#39;s how it works`;
              }
            }
          )}</a>`;
        }
      })}`;
    }
  })} ${validate_component(DashboardLoans, "DashboardLoans").$$render($$result, {}, {}, {})} ${validate_component(DashboardWallet, "DashboardWallet").$$render($$result, {}, {}, {})}</section>`;
});
export {
  Page as default
};
